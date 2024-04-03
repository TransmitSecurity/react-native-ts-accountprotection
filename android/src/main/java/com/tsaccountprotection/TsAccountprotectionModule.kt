package com.tsaccountprotection

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.transmit.accountprotection.ITransmitSecurityTriggerActionEventCallback
import com.transmit.accountprotection.TSAccountProtection
import com.transmit.accountprotection.TransmitSecurityTriggerActionResponse
import com.transmit.accountprotection.api.ActionEventOptions
import com.transmit.accountprotection.api.PayeeData
import com.transmit.accountprotection.api.PayerData
import com.transmit.accountprotection.api.TransactionData
import com.transmit.accountprotection.errors.TransmitSecurityAccountProtectionError


class TsAccountprotectionModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  companion object {
    const val NAME = "TsAccountprotection"
  }

  override fun getName(): String {
    return NAME
  }

  // region Account Protection SDK API

  @ReactMethod
  fun initialize(clientId: String) {
    if(reactContext.currentActivity != null) {
      Log.d("TS", ">>> initialize clientId=$clientId")
      TSAccountProtection.initialize(reactContext, clientId)
    }
  }

  @ReactMethod
  fun setUserId(userId: String) {
    if(reactContext.currentActivity != null) {
      Log.d("TS", ">>> setUserId userId=$userId")
      TSAccountProtection.setUserID(userId)
    }
  }

  @ReactMethod
  fun clearUser() {
    if(reactContext.currentActivity != null) {
      Log.d("TS", ">>> clearUser")
      TSAccountProtection.clearUser()
    }
  }

  @ReactMethod
  fun triggerAction(action: String, options: Map<String, Any>, promise: Promise) {
    if(reactContext.currentActivity != null) {
      Log.d("TS", ">>> triggerAction $action")

      val actionEventOptions = convertOptions(options)
      val transactionData = convertTransactionData(options)

      TSAccountProtection.triggerAction(
        action,
        // Optional, pass 'null' if not used
        object : ActionEventOptions {
          override val correlationId: String?
            get() = actionEventOptions.claimUserId
          override val claimUserId: String?
            get() = actionEventOptions.claimUserId
          override val referenceUserId: String?
            get() = actionEventOptions.referenceUserId
        },
        // Optional, pass 'null' if not used
        object : TransactionData {
          override val amount: Double?
            get() = transactionData.amount
          override val currency: String?
            get() = transactionData.currency
          override val reason: String?
            get() = transactionData.reason
          override val transactionDate: Long?
            get() = transactionData.transactionDate
          override val payer: PayerData
            get() = transactionData.payer!!
          override val payee: PayeeData
            get() = transactionData.payee!!
        },
        object : ITransmitSecurityTriggerActionEventCallback {
          override fun onResponse(token: TransmitSecurityTriggerActionResponse) {
            val actionToken = token.token()
            val map: WritableMap = WritableNativeMap()
            map.putBoolean("success", true)
            map.putString("actionToken", actionToken)
            promise.resolve(map)
          }
          override fun onFailed(error: TransmitSecurityAccountProtectionError) {
            val responseError = error.errorMessage
            Log.e("TS", ">>> $responseError")
            promise.reject("error", responseError);
          }
        }
      )
    }
  }

  // endregion

  private fun convertOptions(options: Map<String, Any>): ActionEventOptions {
    return ActionOptions(
      if(options.contains("correlationId")) options["correlationId"] as String else null,
      if(options.contains("claimUserId")) options["claimUserId"] as String else null,
      if(options.contains("referenceUserId")) options["referenceUserId"] as String else null
    )
  }

  private fun convertTransactionData(options: Map<String, Any>): TransactionData {
    val transactionData =
      if(options.contains("transactionData")) options["transactionData"] as Map<String, Any> else null

    var payee = PayeeData(null, null, null, null)
    if(transactionData?.contains("payee") == true) {
      val data = transactionData["payee"] as Map<String, Any>
      payee = PayeeData(
        if(data.contains("name")) data["name"] as String else null,
        if(data.contains("bankIdentifier")) data["bankIdentifier"] as String else null,
        if(data.contains("branchIdentifier")) data["branchIdentifier"] as String else null,
        if(data.contains("accountNumber")) data["accountNumber"] as String else null)
      }

    var payer = PayerData(null, null, null)
    if(transactionData?.contains("payer") == true) {
      val data = transactionData["payer"] as Map<String, Any>
      payer = PayerData(
        if(data.contains("name")) data["name"] as String else null,
        if(data.contains("bankIdentifier")) data["bankIdentifier"] as String else null,
        if(data.contains("accountNumber")) data["accountNumber"] as String else null)
    }

    return ActionTransactionData(
      if(transactionData?.contains("amount") == true) transactionData["amount"] as Double else null,
      if(transactionData?.contains("currency") == true) transactionData["currency"] as String else null,
      if(transactionData?.contains("reason") == true) transactionData["reason"] as String else null,
      if(transactionData?.contains("transactionDate") == true) transactionData["transactionDate"] as Long else null,
      payee,
      payer
    )
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun multiply(a: Double, b: Double, promise: Promise) {
    promise.resolve(a * b)
  }

}

class ActionOptions(
  override val claimUserId: String?,
  override val correlationId: String?,
  override val referenceUserId: String?
) : ActionEventOptions

class ActionTransactionData(
  override val amount: Double?,
  override val currency: String?,
  override val reason: String?,
  override val transactionDate: Long?,
  override val payee: PayeeData,
  override val payer: PayerData
): TransactionData

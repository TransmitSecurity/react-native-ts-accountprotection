package com.tsaccountprotection

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
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
  fun initializeSDKIOS() {
    Log.d("TS", "Do nothing Android TSAccountProtectionSDK is initialized from application onCreate")
  }

  @ReactMethod
  fun initializeIOS(clientId: String, baseUrl: String) {
    Log.d("TS", "Do nothing Android TSAccountProtectionSDK is initialized from application onCreate")
  }

  @ReactMethod
  fun setUserId(userId: String) {
    if(reactContext.currentActivity != null) {
      Log.d("TS", ">>> setUserId userId=$userId")
      TSAccountProtection.setUserID(userId)
      reactContext.resources.getString(R.string.transmit_security_client_id)
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
  fun triggerAction(action: String, options: ReadableMap, promise: Promise) {
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

  @ReactMethod
  fun setLogLevel(logIsEnabled: Boolean) {
    if(reactContext.currentActivity != null) {
      Log.d("TS", ">>> setLogLevel logIsEnabled=$logIsEnabled")
      TSAccountProtection.setLoggingEnabled(logIsEnabled);
    }
  }

  // endregion

  private fun convertOptions(options: ReadableMap): ActionEventOptions {
    return ActionOptions(
      if(options.hasKey("correlationId")) options.getString("correlationId") as String else null,
      if(options.hasKey("claimUserId")) options.getString("claimUserId") as String else null,
      if(options.hasKey("referenceUserId")) options.getString("referenceUserId") as String else null
    )
  }

  private fun convertTransactionData(options: ReadableMap): TransactionData {
    val transactionData =
      if(options.hasKey("transactionData")) options.getMap("transactionData") else null

    var payee = PayeeData(null, null, null, null)
    if(transactionData?.hasKey("payee") == true) {
      val data = transactionData.getMap("payee")
      payee = PayeeData(
        if(data!!.hasKey("name")) data.getString("name") else null,
        if(data.hasKey("bankIdentifier")) data.getString("bankIdentifier") else null,
        if(data.hasKey("branchIdentifier")) data.getString("branchIdentifier") else null,
        if(data.hasKey("accountNumber")) data.getString("accountNumber") else null)
      }

    var payer = PayerData(null, null, null)
    if(transactionData?.hasKey("payer") == true) {
      val data = transactionData.getMap("payer")
      payer = PayerData(
        if(data!!.hasKey("name")) data.getString("name") else null,
        if(data.hasKey("bankIdentifier")) data.getString("bankIdentifier") else null,
        if(data.hasKey("accountNumber")) data.getString("accountNumber") else null)
    }

    return ActionTransactionData(
      if(transactionData?.hasKey("amount") == true) transactionData.getDouble("amount") else null,
      if(transactionData?.hasKey("currency") == true) transactionData.getString("currency") else null,
      if(transactionData?.hasKey("reason") == true) transactionData.getString("reason") else null,
      if(transactionData?.hasKey("transactionDate") == true) transactionData.getDouble("transactionDate").toLong() else null,
      payee,
      payer
    )
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

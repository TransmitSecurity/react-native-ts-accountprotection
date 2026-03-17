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
import com.transmit.accountprotection.collection.datamanagement.location.TSLocationCollectionMode
import com.transmit.accountprotection.errors.TransmitSecurityAccountProtectionError
import com.transmit.accountprotection.userdetails.ISessionTokenCallback
import com.transmit.accountprotection.collection.datamanagement.location.TSLocationConfig


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
  fun initializeSDKIOS(promise: Promise) {
    Log.d("TS", "Do nothing Android TSAccountProtectionSDK is initialized from application onCreate")
    promise.resolve(false)
  }

  @ReactMethod
  fun initializeIOS(clientId: String, baseUrl: String, promise: Promise) {
    Log.d("TS", "Do nothing Android TSAccountProtectionSDK is initialized from application onCreate")
    promise.resolve(false)
  }

  @ReactMethod
  fun setUserId(userId: String, promise: Promise) {
    if(reactContext.currentActivity != null) {
      Log.d("TS", ">>> setUserId userId=$userId")
      TSAccountProtection.setUserID(userId)
      reactContext.resources.getString(R.string.transmit_security_client_id)
      promise.resolve(true)
    } else {
      promise.reject("error", "Activity not available")
    }
  }

  @ReactMethod
  fun clearUser(promise: Promise) {
    if(reactContext.currentActivity != null) {
      Log.d("TS", ">>> clearUser")
      TSAccountProtection.clearUser()
      promise.resolve(true)
    } else {
      promise.reject("error", "Activity not available")
    }
  }

  @ReactMethod
  fun getSessionToken(promise: Promise) {
    if(reactContext.currentActivity != null) {
      TSAccountProtection.getSessionToken(object : ISessionTokenCallback {
        override fun onSessionToken(sessionToken: String) {
          promise.resolve(sessionToken)
        }

        override fun onFailed(error: TransmitSecurityAccountProtectionError) {
          promise.reject("error", error.errorMessage)
        }
      })
    } else {
      promise.reject("error", "Activity not available")
    }
  }

  @ReactMethod
  fun triggerAction(action: String, options: ReadableMap, locationConfig: ReadableMap?, promise: Promise) {
    if(reactContext.currentActivity != null) {
      Log.d("TS", ">>> triggerAction $action")

      val tsLocationConfig = convertLocationConfig(locationConfig)

      TSAccountProtection.triggerAction(
        action,
        tsLocationConfig,
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
  fun setLogLevel(logIsEnabled: Boolean, promise: Promise) {
    if(reactContext.currentActivity != null) {
      Log.d("TS", ">>> setLogLevel logIsEnabled=$logIsEnabled")
      TSAccountProtection.setLoggingEnabled(logIsEnabled);
      promise.resolve(true)
    } else {
      promise.reject("error", "Activity not available")
    }
  }

  // endregion

  private fun convertLocationConfig(locationConfig: ReadableMap?): TSLocationConfig? {
    if (locationConfig == null) return null

    val mode = locationConfig.getString("mode")
    val validFor = if (locationConfig.hasKey("validFor")) locationConfig.getInt("validFor") else 300

    return when (mode) {
      "disabled" -> TSLocationConfig(TSLocationCollectionMode.Disable)
      "default" -> TSLocationConfig(TSLocationCollectionMode.Default)
      "forceCurrent" -> TSLocationConfig(TSLocationCollectionMode.ForceCurrent)
      "forceLastKnown" -> TSLocationConfig(TSLocationCollectionMode.ForceLastKnown)
      "lastKnown" ->  TSLocationConfig(TSLocationCollectionMode.LastKnown(validFor))
      else -> TSLocationConfig(TSLocationCollectionMode.Default)
    }
  }

  private fun convertOptions(options: ReadableMap): ActionEventOptions {
    return ActionOptions(
      correlationId = options.getString("correlationId"),
      claimUserId = options.getString("claimUserId"),
      referenceUserId = options.getString("referenceUserId")
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

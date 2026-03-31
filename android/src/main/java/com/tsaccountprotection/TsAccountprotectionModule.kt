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
  fun setAuthenticatedUser(userId: String, options: ReadableMap?, promise: Promise) {
    if(reactContext.currentActivity != null) {
      Log.d("TS", ">>> setAuthenticatedUser userId=$userId, options=$options")
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

      val actionEventOptions = convertOptions(options)
      val transactionData = convertTransactionData(options)
      val tsLocationConfig = convertLocationConfig(locationConfig)

      TSAccountProtection.triggerAction(
        action,
        // Optional, pass 'null' if not used
        object : ActionEventOptions {
          override val correlationId: String?
            get() = actionEventOptions.correlationId
          override val claimUserId: String?
            get() = actionEventOptions.claimUserId
          override val claimedUserId: String?
            get() = actionEventOptions.claimedUserId
          override val claimedUserIdType: com.transmit.accountprotection.api.TSClaimedUserIdType?
            get() = actionEventOptions.claimedUserIdType
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

  @ReactMethod
  fun logPageLoad(pageName: String, promise: Promise) {
    if(reactContext.currentActivity != null) {
      Log.d("TS", ">>> logPageLoad pageName=$pageName")
      TSAccountProtection.logPageLoad(pageName)
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
    // For backward compatibility: use claimedUserId if provided, otherwise fall back to claimUserId
    val claimUserId = options.getString("claimUserId")
    val claimedUserId = options.getString("claimedUserId")
    val finalClaimedUserId = claimedUserId ?: claimUserId
    
    return ActionOptions(
      correlationId = options.getString("correlationId"),
      claimUserId = claimUserId, // Keep for backward compatibility
      claimedUserId = finalClaimedUserId,
      claimedUserIdType = convertStringToClaimedUserIdType(options.getString("claimedUserIdType")),
      referenceUserId = options.getString("referenceUserId")
    )
  }

  private fun convertStringToClaimedUserIdType(typeString: String?): com.transmit.accountprotection.api.TSClaimedUserIdType? {
    return when (typeString) {
      "email" -> com.transmit.accountprotection.api.TSClaimedUserIdType.EMAIL
      "username" -> com.transmit.accountprotection.api.TSClaimedUserIdType.USERNAME
      "phone_number" -> com.transmit.accountprotection.api.TSClaimedUserIdType.PHONE_NUMBER
      "account_id" -> com.transmit.accountprotection.api.TSClaimedUserIdType.ACCOUNT_ID
      "ssn" -> com.transmit.accountprotection.api.TSClaimedUserIdType.SSN
      "national_id" -> com.transmit.accountprotection.api.TSClaimedUserIdType.NATIONAL_ID
      "passport_number" -> com.transmit.accountprotection.api.TSClaimedUserIdType.PASSPORT_NUMBER
      "drivers_license_number" -> com.transmit.accountprotection.api.TSClaimedUserIdType.DRIVERS_LICENSE_NUMBER
      "other" -> com.transmit.accountprotection.api.TSClaimedUserIdType.OTHER
      else -> null
    }
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
  override val claimedUserId: String?,
  override val claimedUserIdType: com.transmit.accountprotection.api.TSClaimedUserIdType?,
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

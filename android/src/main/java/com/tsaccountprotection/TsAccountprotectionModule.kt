package com.tsaccountprotection

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
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
  fun triggerAction(action: String, options: ActionEventOptions) {
    if(reactContext.currentActivity != null) {
      Log.d("TS", ">>> triggerAction $action")

      TSAccountProtection.triggerAction(
        action,
        // Optional, pass 'null' if not used
        object : ActionEventOptions {
          override val correlationId: String?
            get() = correlationIdStr
          override val claimUserId: String?
            get() = claimUserIdStr
          override val referenceUserId: String?
            get() = referenceUserIdStr
        },
        // Optional, pass 'null' if not used
        object : TransactionData {
          override val amount: Double?
            get() = transactionAmount
          override val currency: String?
            get() = transactionCurrency
          override val reason: String?
            get() = transactionReason
          override val transactionDate: Long?
            get() = transactionDate
          override val payer: PayerData?
            get() = PayerData(payerName,payerBranchIdentifier,payerAccountNumber)
          override val payee: PayeeData?
            get() = PayeeData(payeeName,payeeBankIdentifier,payeeBranchIdentifier,payeeAccountNumber)
        },
        object : ITransmitSecurityTriggerActionEventCallback {
          override fun onResponse(token: TransmitSecurityTriggerActionResponse) {
            val responseToken = token.token()
          }
          override fun onFailed(error: TransmitSecurityAccountProtectionError) {
            val responseError = error.errorMessage
          }
        }
      )
    }
  }

  // endregion

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun multiply(a: Double, b: Double, promise: Promise) {
    promise.resolve(a * b)
  }

}

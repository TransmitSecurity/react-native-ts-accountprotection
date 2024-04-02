package com.tsaccountprotection

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.transmit.accountprotection.TSAccountProtection

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



  // endregion

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun multiply(a: Double, b: Double, promise: Promise) {
    promise.resolve(a * b)
  }

}

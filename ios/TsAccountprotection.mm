#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(TsAccountprotection, NSObject)

RCT_EXTERN_METHOD(initializeSDKIOS:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(initializeIOS:(NSString *)clientId baseUrl:(NSString*)baseUrl configurations:(NSDictionary*)configurations withResolver:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setUserId:(NSString *)userId withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(triggerAction:(NSString *)action options:(NSDictionary*)options withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(clearUser:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setLogLevel:(BOOL)logIsEnabled withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end

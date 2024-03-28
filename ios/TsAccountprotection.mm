#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(TsAccountprotection, NSObject)


RCT_EXTERN_METHOD(initialize:(NSString*)clientId baseUrl:(NSString*)baseUrl withResolver:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setUserId:(NSString *)userId withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)



//RCT_EXTERN_METHOD(register:(NSString *)username displayName:(NSString*)displayName withResolver:(RCTPromiseResolveBlock)resolve
//                  withRejecter:(RCTPromiseRejectBlock)reject)

//RCT_EXTERN_METHOD(signTransaction:(NSString *)username withResolver:(RCTPromiseResolveBlock)resolve
//                  withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end

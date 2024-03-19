import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-ts-accountprotection' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const TsAccountprotection = NativeModules.TsAccountprotection
  ? NativeModules.TsAccountprotection
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export namespace TSAccountProtectionSDK {

  // export interface TSRegistrationResult {
  //   result: string;
  // }
}

export interface TSAccountProtectionSDKModule {
  initialize: (clientId: string, baseUrl: string) => Promise<boolean>;
}

class RNAccountProtectionSDK implements TSAccountProtectionSDKModule {

  initialize(clientId: string, baseUrl: string): Promise<boolean> {
    return TsAccountprotection.initialize(clientId, baseUrl);
  }

}
export default new RNAccountProtectionSDK();
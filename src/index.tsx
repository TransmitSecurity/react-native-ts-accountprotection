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

  export interface TSPayer {
    name?: string;
    branchIdentifier?: string;
    accountNumber?: string;
  }

  export interface TSPayee {
    name?: string;
    bankIdentifier?: string;
    branchIdentifier?: string;
    accountNumber?: string;
  }

  export interface TSTransactionData {
    amount: number;
    currency: string;
    reason?: string;
    transactionDate?: number;
    payer?: TSPayer;
    payee?: TSPayee;
  }
  
  export interface TSActionEventOptions {
    correlationId?: string;
    claimUserId?: string;
    referenceUserId?: string;
    transactionData?: TSTransactionData;
  }
}

export interface TSAccountProtectionSDKModule {
  initialize: (clientId: string, baseUrl: string) => Promise<boolean>;
  setUserId: (userId: string) => Promise<boolean>;
}

class RNAccountProtectionSDK implements TSAccountProtectionSDKModule {

  initialize(clientId: string, baseUrl: string): Promise<boolean> {
    return TsAccountprotection.initialize(clientId, baseUrl);
  }

  setUserId(userId: string): Promise<boolean> {
    return TsAccountprotection.setUserId(userId);
  }
}
export default new RNAccountProtectionSDK();
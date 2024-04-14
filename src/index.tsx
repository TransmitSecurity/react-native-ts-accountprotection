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

  export interface TSSetActionResponse {
    success: boolean;
    actionToken: string;
    error: string;
  }

  export const enum TSAction {
    login = 'login',
    register = 'register',
    transaction = 'transaction',
    checkout = 'checkout',
    password_reset = 'password_reset',
    logout = 'logout',
    account_details_change = 'account_details_change',
    account_auth_change = 'account_auth_change',
    withdraw = 'withdraw',
    credits_change = 'credits_change',
  }
}

export interface TSAccountProtectionSDKModule {
  initialize: (clientId: string) => Promise<boolean>;
  setUserId: (userId: string) => Promise<boolean>;
  triggerAction: (action: string, options?: TSAccountProtectionSDK.TSActionEventOptions) => Promise<TSAccountProtectionSDK.TSSetActionResponse>;
  clearUser: () => Promise<boolean>;
}

class RNAccountProtectionSDK implements TSAccountProtectionSDKModule {

  initialize(clientId: string): Promise<boolean> {
    return TsAccountprotection.initialize(clientId);
  }

  initializeSDK(): Promise<boolean> {
    return TsAccountprotection.initializeSDK();
  }

  setUserId(userId: string): Promise<boolean> {
    return TsAccountprotection.setUserId(userId);
  }

  triggerAction(action: string, options?: TSAccountProtectionSDK.TSActionEventOptions): Promise<TSAccountProtectionSDK.TSSetActionResponse> {
    return TsAccountprotection.triggerAction(action, options);
  }

  clearUser(): Promise<boolean> {
    return TsAccountprotection.clearUser();
  }
}
export default new RNAccountProtectionSDK();
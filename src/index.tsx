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

// Type definitions
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

// SDK Functions - Direct exports of the native module methods
export function initializeSDKIOS(): Promise<boolean> {
  return TsAccountprotection.initializeSDK();
}

export function initializeIOS(clientId: string, baseUrl?: string | null): Promise<boolean> {
  return TsAccountprotection.initializeIOS(clientId, baseUrl);
}

export function setUserId(userId: string): Promise<boolean> {
  return TsAccountprotection.setUserId(userId);
}

export function triggerAction(action: string, options?: TSActionEventOptions): Promise<TSSetActionResponse> {
  return TsAccountprotection.triggerAction(action, options);
}

export function clearUser(): Promise<boolean> {
  return TsAccountprotection.clearUser();
}

export function setLogLevel(isLogEnabled: boolean): Promise<boolean> {
  return TsAccountprotection.setLogLevel(isLogEnabled);
}
import TsAccountprotection from './NativeTsAccountprotection';

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
  /** @deprecated Use claimedUserId instead */
  claimUserId?: string;
  claimedUserId?: string;
  claimedUserIdType?: TSClaimedUserIdType;
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

export const enum TSClaimedUserIdType {
  email = 'email',
  username = 'username',
  phoneNumber = 'phone_number',
  accountId = 'account_id',
  ssn = 'ssn',
  nationalId = 'national_id',
  passportNumber = 'passport_number',
  driversLicenseNumber = 'drivers_license_number',
  other = 'other',
}

export interface TSLocationConfig {
  mode: 'disabled' | 'default' | 'forceCurrent' | 'forceLastKnown' | 'lastKnown';
  validFor?: number | null | undefined; // return last-known only if it is not older than `validFor` minutes.
}

export interface TSInitSDKConfiguration {
  enableTrackingBehavioralData?: boolean;
  enableLocationEvents?: boolean;
}

export interface TSAuthenticatedUserOptions {
  [key: string]: any;
}

// SDK Functions — public API is unchanged. These wrap the Turbo Module spec and
// normalize `undefined -> null` because the codegen spec models optional
// arguments as required-nullable.
export function initializeSDKIOS(): Promise<boolean> {
  return TsAccountprotection.initializeSDKIOS();
}

export function initializeIOS(
  clientId: string,
  baseUrl: string,
  configuration?: TSInitSDKConfiguration | null,
  userId?: string | null
): Promise<boolean> {
  return TsAccountprotection.initializeIOS(
    clientId,
    baseUrl,
    configuration ?? null,
    userId ?? null
  );
}

export function setAuthenticatedUser(
  userId: string,
  options?: TSAuthenticatedUserOptions
): Promise<boolean> {
  return TsAccountprotection.setAuthenticatedUser(userId, options ?? null);
}

export function triggerAction(
  action: string,
  options?: TSActionEventOptions,
  locationConfig?: TSLocationConfig,
  customAttributes?: { [key: string]: any }
): Promise<TSSetActionResponse> {
  return TsAccountprotection.triggerAction(
    action,
    options ?? null,
    locationConfig ?? null,
    customAttributes ?? null
  ) as unknown as Promise<TSSetActionResponse>;
}

export function clearUser(): Promise<boolean> {
  return TsAccountprotection.clearUser();
}

export function getSessionToken(): Promise<string> {
  return TsAccountprotection.getSessionToken();
}

export function setLogLevel(isLogEnabled: boolean): Promise<boolean> {
  return TsAccountprotection.setLogLevel(isLogEnabled);
}

export function logPageLoad(pageName: string): Promise<boolean> {
  return TsAccountprotection.logPageLoad(pageName);
}

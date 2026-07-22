import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

/**
 * Codegen spec for the Account Protection Turbo Module.
 *
 * Notes on typing (see docs/TURBO_MIGRATION_PLAN.md):
 *  - Freeform maps (configuration/options/locationConfig/customAttributes) are
 *    typed as `Object` (codegen UnsafeObject) to preserve the plugin's loose
 *    runtime contract without over-constraining callers.
 *  - Optional arguments are modeled as required-nullable (`T | null`); the public
 *    wrappers in index.tsx normalize `undefined -> null`. This avoids codegen's
 *    optional-argument edge cases while keeping the public API optional.
 *  - Enums are passed as `string` (codegen cannot consume TS enums); the public
 *    TSAction / TSClaimedUserIdType enums live in index.tsx.
 *  - triggerAction returns `Object`; index.tsx casts it to TSSetActionResponse.
 */
export interface Spec extends TurboModule {
  initializeSDKIOS(): Promise<boolean>;
  initializeIOS(
    clientId: string,
    baseUrl: string,
    configuration: Object | null,
    userId: string | null
  ): Promise<boolean>;
  setAuthenticatedUser(userId: string, options: Object | null): Promise<boolean>;
  triggerAction(
    action: string,
    options: Object | null,
    locationConfig: Object | null,
    customAttributes: Object | null
  ): Promise<Object>;
  clearUser(): Promise<boolean>;
  getSessionToken(): Promise<string>;
  setLogLevel(logIsEnabled: boolean): Promise<boolean>;
  logPageLoad(pageName: string): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('TsAccountprotection');

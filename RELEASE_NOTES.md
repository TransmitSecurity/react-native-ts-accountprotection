# Release Notes

## Version 1.0.0

### 🚀 Major Release - Native SDK Updates & API Enhancements

### 🔄 Native SDK Updates
- **Updated Android and iOS native SDKs**: Upgraded TransmitSecurity Account Protection SDK to **3.0.0**

### 🆕 New APIs
- **Added `getSessionToken()`**: New method to retrieve the current session token
- **Added `clearUser()`**: New method to clear the currently authenticated user
- **Added `logPageLoad(pageName: string)`**: New method to log page load events for tracking user navigation

### ✨ Enhanced APIs
- **Updated `initializeIOS()`**: 
  - Made `baseUrl` a required parameter (previously optional)
  - Added support for initialization `configuration` parameter to enable location tracking on iOS
  - Added support for `userId` parameter during initialization
- **Enhanced `triggerAction()`**: 
  - Added support for location configuration via `locationConfig` parameter
  - Added support for `customAttributes` parameter for additional event data
  - Updated API signature for improved flexibility
- **Renamed `setUser()` to `setAuthenticatedUser()`**: Method renamed for better clarity and consistency

### 🛠️ Configuration Enhancements
- **iOS Location Support**: Added configuration option to enable location data collection during SDK initialization
- **Location in Actions**: Trigger Action now supports location configuration with modes: `disabled`, `default`, `forceCurrent`, `forceLastKnown`, `lastKnown`
- **Custom Attributes**: Enhanced event tracking with support for custom attributes in trigger actions
- **Behavioral Data Collection**: To collect behavioral data from UI elements, developers must add `testID` attributes to trackable elements (buttons, inputs, etc.)

### ⚠️ Breaking Changes
- **`baseUrl` is now required** in `initializeIOS()` method
- **`setUser()` renamed to `setAuthenticatedUser()`** - update your method calls
- **⚠️ CRITICAL: baseUrl must include `/risk-collect/` postfix** - e.g., `https://api.transmitsecurity.io/risk-collect/` (server connection will fail without this)
- **Behavioral tracking requirement**: UI elements must include `testID` attributes to be tracked for behavioral data
- Native SDK version updates may require testing existing integrations
- Some method signatures have been enhanced with additional optional parameters

## Version 0.2.1

### 🐛 Bug Fixes
- **Fixed initializeSDKIOS function**: Resolved critical issue where `initializeSDKIOS()` was undefined due to incorrect native bridge method mapping
  - The function was incorrectly calling `TsAccountprotection.initializeSDK()` instead of `TsAccountprotection.initializeSDKIOS()`
  - This caused runtime errors when trying to initialize the SDK on iOS without parameters
  - Updated example app to use correct `initializeSDKIOS()` method call

### Technical Details
- Corrected native method bridge mapping in `initializeSDKIOS` function
- Updated example implementation to demonstrate proper usage

## Version 0.2.0

### 🚀 Major API Refactor - Breaking Changes

This release introduces a significant improvement to the module's API design, transitioning from a mixed export pattern to clean named exports. This change aligns with modern React Native best practices and provides a better developer experience.

### Breaking Changes
- **Removed default export**: The module no longer exports a default class instance
- **Eliminated namespace**: All types previously under `TSAccountProtectionSDK` namespace are now direct exports
- **Updated import syntax**: Imports now use named imports instead of mixed default + named imports
- **Simplified type references**: Types no longer require namespace prefixes

### API Changes

**Before:**
```js
import TSAccountProtectionSDKModule, { TSAccountProtectionSDK } from 'react-native-ts-accountprotection';

await TSAccountProtectionSDKModule.initializeIOS(clientId);
await TSAccountProtectionSDKModule.triggerAction(TSAccountProtectionSDK.TSAction.login, options);
```

**After:**
```js
import { initializeIOS, triggerAction, TSAction } from 'react-native-ts-accountprotection';

await initializeIOS(clientId);
await triggerAction(TSAction.login, options);
```

### Benefits
- **Tree-shaking support**: Enables better bundle optimization and smaller app sizes
- **Cleaner imports**: More intuitive and concise import statements
- **Better IntelliSense**: Improved TypeScript auto-completion and code navigation
- **Modern standards**: Follows current React Native community best practices
- **Simplified usage**: No more verbose namespace references

### Migration
A complete migration guide is available in `MIGRATION_0.1.9-0.2.0.md` with step-by-step instructions for updating your existing code.

### Technical Details
- Removed wrapper class layer for direct native module access
- Streamlined type definitions without nested namespaces
- Maintained full API functionality while improving ergonomics

## Version 0.1.9

### Breaking Changes (iOS only)
- **Removed TSConfiguration interface**: Simplified SDK initialization by removing configuration options
- **Updated initializeIOS method**: No longer accepts configuration parameters - now only requires `clientId` and optional `baseUrl`
- **Removed tracking configuration options**: Eliminated `enableTrackingBehavioralData`, `enableLocationEvents`, `enableTrackingNavigationData`, and `enableTrackingStaticData` parameters

### API Changes
- **Simplified initialization**: `initializeIOS(clientId: string, baseUrl?: string)` - configuration parameter removed
- **Backward compatibility**: Existing code using `initializeSDKIOS()` continues to work unchanged

## Version 0.1.8

### Enhanced Configuration Options
- **Added new tracking configuration options**: Enhanced SDK initialization with more granular control over data collection
  - `enableTrackingNavigationData`: Control app navigation pattern tracking (default: true)
  - `enableTrackingStaticData`: Control device/app static information tracking (default: true)
- **Updated default behavior**: All tracking options now default to `true` for improved security coverage
- **Enhanced `TSConfiguration` interface**: Added support for the new tracking options while maintaining backward compatibility

### API Changes
- **Updated initialization parameters**: Extended `TSConfiguration` with new optional boolean flags for fine-grained tracking control

## Version 0.1.7

### SDK Updates  
- **Updated to latest native SDK**: Module now uses specific Account Protection SDK version number for improved stability and consistency
- **Enhanced dependency management**: Locked native SDK dependencies to ensure reliable builds and predictable behavior

## Version 0.1.6

### Code Improvements
- **Simplified Android parameter handling**: Refactored `convertOptions` method to use named parameters and cleaner null handling for better code maintainability

## Version 0.1.5

### New Features
- **Enhanced iOS initialization with configuration options**: The `initializeIOS` method now accepts an optional `configurations` parameter
  - `enableTrackingBehavioralData`: Control behavioral data tracking (default: false)
  - `enableLocationEvents`: Control location event tracking (default: false)
  - Usage: `await TSAccountProtectionSDKModule.initializeIOS(clientId, baseUrl, { enableTrackingBehavioralData: false, enableLocationEvents: false })`

### API Changes
- **Updated `initializeIOS` signature**: Added optional `TSConfiguration` parameter for iOS-specific configuration options
- **New `TSConfiguration` interface**: Defines configuration options for SDK initialization

## Version 0.1.4

### New Features
- **Added `setLogLevel` method**: New API to enable/disable SDK logging for debugging purposes
  - Accepts a boolean parameter: `true` to enable debug logging, `false` to disable
  - Available on both iOS and Android platforms
  - Usage: `await TSAccountProtectionSDKModule.setLogLevel(true)`

### Bug Fixes
- **Fixed correlationId mapping in Android**: Corrected the mapping of `correlationId` parameter in action event options (was incorrectly mapped to `claimUserId`)

### SDK Updates
- **Android**: Updated AccountProtection SDK from `2.1.+` to `2.2.4`
- **iOS**: Updated AccountProtection SDK from `2.1.12` to `2.1.14`


## Previous Versions

### Version 0.1.3
- Initial release with core functionality
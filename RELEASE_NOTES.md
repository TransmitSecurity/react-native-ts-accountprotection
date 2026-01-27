# Release Notes

## Version 0.1.9

### Breaking Changes
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
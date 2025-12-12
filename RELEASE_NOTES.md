# Release Notes

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
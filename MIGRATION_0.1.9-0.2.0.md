# Migration Guide: v0.1.9 → v0.2.0

## Breaking Changes

### Import Syntax Changes

**Before (v0.1.9):**
```js
import TSAccountProtectionSDKModule, { TSAccountProtectionSDK } from 'react-native-ts-accountprotection';
```

**After (v0.2.0):**
```js
import { 
  initializeSDKIOS, 
  setAuthenticatedUser, 
  triggerAction, 
  clearUser, 
  setLogLevel, 
  TSAction,
  TSClaimedUserIdType,
  type TSActionEventOptions,
  type TSAuthenticatedUserOptions
} from 'react-native-ts-accountprotection';
```

### API Usage Changes

| Function | Before | After |
|----------|--------|-------|
| Initialize iOS | `TSAccountProtectionSDKModule.initializeSDKIOS()` | `initializeSDKIOS()` |
| Set User ID | `TSAccountProtectionSDKModule.setUserId(id)` | `setAuthenticatedUser(id, options?)` |
| Trigger Action | `TSAccountProtectionSDKModule.triggerAction(...)` | `triggerAction(...)` |
| Clear User | `TSAccountProtectionSDKModule.clearUser()` | `clearUser()` |
| Set Log Level | `TSAccountProtectionSDKModule.setLogLevel(...)` | `setLogLevel(...)` |

### Type Reference Changes

| Type | Before | After |
|------|--------|-------|
| Actions | `TSAccountProtectionSDK.TSAction.login` | `TSAction.login` |
| Event Options | `TSAccountProtectionSDK.TSActionEventOptions` | `TSActionEventOptions` |
| Response | `TSAccountProtectionSDK.TSSetActionResponse` | `TSSetActionResponse` |

## Trigger Action API Changes

### TSActionEventOptions Updates

The `claimUserId` field has been **deprecated** in favor of new fields:

**Before (still works but deprecated):**
```js
const options = {
  claimUserId: "user123",
  correlationId: "correlation-123"
}
```

**After (recommended):**
```js
import { TSClaimedUserIdType } from 'react-native-ts-accountprotection';

const options = {
  claimedUserId: "user@example.com",
  claimedUserIdType: TSClaimedUserIdType.email,
  correlationId: "correlation-123"
}
```

**Available TSClaimedUserIdType values:**
- `TSClaimedUserIdType.email`
- `TSClaimedUserIdType.username`
- `TSClaimedUserIdType.phoneNumber`
- `TSClaimedUserIdType.accountId`
- `TSClaimedUserIdType.ssn`
- `TSClaimedUserIdType.nationalId`
- `TSClaimedUserIdType.passportNumber`
- `TSClaimedUserIdType.driversLicenseNumber`
- `TSClaimedUserIdType.other`
const options = {
  claimUserId: "user123", // @deprecated - still works for backward compatibility
  claimedUserId: "user@example.com", // NEW - preferred field
  claimedUserIdType: TSClaimedUserIdType.email, // NEW - specifies identifier type
  correlationId: "correlation-123"
}
```

### New TSClaimedUserIdType Enum

Available values:
- `TSClaimedUserIdType.email`
- `TSClaimedUserIdType.phone`
- `TSClaimedUserIdType.username`
- `TSClaimedUserIdType.customerId`

## Quick Migration Steps

1. **Update imports** - Replace the old import with individual named imports
2. **Remove module prefix** - Remove `TSAccountProtectionSDKModule.` from all function calls
3. **Update type references** - Remove `TSAccountProtectionSDK.` namespace from type references
4. **Add type imports** - Import types with `type` keyword for TypeScript projects

## Benefits

- ✅ Tree-shaking support for smaller bundle sizes
- ✅ Cleaner, more intuitive API
- ✅ Better TypeScript intellisense
- ✅ Follows React Native community standards

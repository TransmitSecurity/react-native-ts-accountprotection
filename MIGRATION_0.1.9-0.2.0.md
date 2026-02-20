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
  setUserId, 
  triggerAction, 
  clearUser, 
  setLogLevel, 
  TSAction,
  type TSActionEventOptions 
} from 'react-native-ts-accountprotection';
```

### API Usage Changes

| Function | Before | After |
|----------|--------|-------|
| Initialize iOS | `TSAccountProtectionSDKModule.initializeSDKIOS()` | `initializeSDKIOS()` |
| Set User ID | `TSAccountProtectionSDKModule.setUserId(id)` | `setUserId(id)` |
| Trigger Action | `TSAccountProtectionSDKModule.triggerAction(...)` | `triggerAction(...)` |
| Clear User | `TSAccountProtectionSDKModule.clearUser()` | `clearUser()` |
| Set Log Level | `TSAccountProtectionSDKModule.setLogLevel(...)` | `setLogLevel(...)` |

### Type Reference Changes

| Type | Before | After |
|------|--------|-------|
| Actions | `TSAccountProtectionSDK.TSAction.login` | `TSAction.login` |
| Event Options | `TSAccountProtectionSDK.TSActionEventOptions` | `TSActionEventOptions` |
| Response | `TSAccountProtectionSDK.TSSetActionResponse` | `TSSetActionResponse` |

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

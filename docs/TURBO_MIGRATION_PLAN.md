# Turbo Module Migration Plan — MOB-2732

Migrate `react-native-ts-accountprotection` from a legacy (Bridge) native module
to a **backward-compatible Turbo Module**.

## Strategy: backward-compatible, not new-arch-only

A codegen Turbo Module compiles into **both** architectures from one codebase:

- Hosting apps on the **old architecture** (RN 0.68–0.84) keep working unchanged.
- Apps on the **new architecture** get the real Turbo Module (JSI, lazy load, type-safe).
- Apps on **RN 0.85+** (interop layer removed) work *at all* — legacy modules no longer load there.

We remove the **manual legacy bridge** (the "old-arch leftovers"), while keeping the
**codegen-generated dual-mode path** (a single sanctioned `#ifdef RCT_NEW_ARCH_ENABLED`
on iOS is *not* a leftover — it is what keeps old-arch hosts alive).

Going new-arch-*only* would be purer but hard-breaks every old-arch customer — rejected.

## The only unavoidable consumer impact

Public JS API is unchanged **except** the minimum React Native version rises to **≥ 0.71**
(codegen requirement). Ship as a new major (`4.0.0`); keep the `3.x` line installable for
legacy hosts. This is a version-floor bump, not an API change.

## Public API contract to preserve (non-breaking guarantee)

`src/index.tsx` keeps identical exports/signatures:
`initializeSDKIOS, initializeIOS, setAuthenticatedUser, triggerAction, clearUser,
getSessionToken, setLogLevel, logPageLoad` + all public types/enums
(`TSAction, TSClaimedUserIdType, TSActionEventOptions, TSTransactionData,
TSLocationConfig, TSInitSDKConfiguration, TSSetActionResponse`).
Native module name stays **`TsAccountprotection`** (autolinking + `NativeModules` lookups unaffected).

## Type-mapping strategy for codegen

- Freeform maps (`options`, `customAttributes`, `locationConfig`, `configuration`,
  `transactionData`) → `Object` (codegen `UnsafeObject`) to preserve loose behavior.
- Enums → codegen cannot use TS `enum` in a spec; spec methods take `string`. Public enums
  stay in `index.tsx` (string-valued), DX unchanged.
- `triggerAction` return → `Promise<Object>` in the spec; `index.tsx` casts to `TSSetActionResponse`.
- Optional args → codegen needs nullable; `index.tsx` wrappers normalize `undefined → null`.

## File-by-file changes

### JS
- **`src/NativeTsAccountprotection.ts`** (new): the `TurboModule` spec (8 methods, `Object`/`string` typing). `Native` prefix required.
- **`package.json`**: add `codegenConfig` (`name: "RNTsAccountprotectionSpec"`, `type: "modules"`, `jsSrcsDir: "src"`, `android.javaPackageName: "com.tsaccountprotection"`); bump to `4.0.0`; remove `"cpp"` from `files[]`; document min RN ≥ 0.71.
- **`src/index.tsx`**: resolve via `TurboModuleRegistry.getEnforcing<Spec>('TsAccountprotection')`; keep linking-error message; wrappers normalize `undefined → null`; **exports unchanged**.

### Android
- **`TsAccountprotectionModule.kt`**: extend generated `NativeTsAccountprotectionSpec` (not `ReactContextBaseJavaModule`); drop `@ReactMethod`; method bodies unchanged.
- **`TsAccountprotectionPackage.kt`**: `ReactPackage` → `BaseReactPackage`/`TurboReactPackage`; implement `getModule()` + `getReactModuleInfoProvider()` (`isTurboModule=true`); remove `createNativeModules`/`createViewManagers`.
- **`android/build.gradle`**: always apply `com.facebook.react` (codegen on both arch); keep JFrog repo + SDK dep; align AGP/Kotlin to RN 0.71+ baseline; collapse `AndroidManifestNew.xml` split if possible.

### iOS — implemented in Objective-C++ (no Swift), per MOB-2732 decision
- **`TsAccountprotection.mm`**: remove `RCT_EXTERN_MODULE` + all `RCT_EXTERN_METHOD`; implement the generated `NativeTsAccountprotectionSpec` protocol directly in ObjC++; `RCT_EXPORT_MODULE()`; under `#ifdef RCT_NEW_ARCH_ENABLED`, `getTurboModule:` returning `NativeTsAccountprotectionSpecJSI`. Port the current Swift logic to ObjC++.
- **`TsAccountprotection.swift`**: removed (logic ported to ObjC++). `AccountProtection` SDK called from ObjC++.
- **`TsAccountprotection-Bridging-Header.h`**: remove (or strip unused `RCTViewManager` import) — no Swift bridging needed once Swift is gone.
- **`react-native-ts-accountprotection.podspec`**: rely on `install_modules_dependencies(s)`; delete manual `if ENV['RCT_NEW_ARCH_ENABLED']` block. Dependency manager (CocoaPods vs SPM) decided at Phase 2.

## Old-arch leftovers to remove (checklist)
1. `RCT_EXTERN_MODULE` + `RCT_EXTERN_METHOD` (iOS)
2. `@ReactMethod` (Android)
3. `ReactContextBaseJavaModule` base class
4. Plain `ReactPackage` `createNativeModules`/`createViewManagers`
5. Unused `RCTViewManager` import (bridging header)
6. Manual podspec `RCT_NEW_ARCH_ENABLED` block
7. `"cpp"` in `package.json` `files[]`
8. Conditional react-gradle-plugin application + `AndroidManifestNew.xml` duplication (if collapsible)
9. KEEP `turbo.json` — Turborepo (monorepo tool), unrelated to Turbo Modules.

Verification grep (expect only the sanctioned iOS `#ifdef`):
`RCT_EXTERN_MODULE|RCT_EXTERN_METHOD|ReactContextBaseJavaModule|@ReactMethod|createNativeModules|RCTViewManager`

## Verification matrix
Using the demo app (`ts-accountprotection-demo`) as host proxy via the symlink:
1. Android new arch (RN 0.83, `newArchEnabled=true`): true Turbo Module, 201s + behavioral collection.
2. Android old arch (`newArchEnabled=false`): still works → non-breaking for old-arch hosts.
3. iOS new arch: pod install + build + run.
4. iOS old arch: build + run.
5. (Stretch) RN 0.85 app: loads as Turbo Module.
6. API parity: diff `index.tsx` exports before/after → identical.
7. Codegen artifacts generated on both platforms.
8. Leftover grep clean.

## Sequencing
- **Phase 1 — JS + Android**: spec, codegenConfig, index.tsx, Android module + package, build.gradle → verify Android new + old arch.
- **Phase 2 — iOS (ObjC++)**: port to ObjC++, `.mm` shim, podspec cleanup, CocoaPods-vs-SPM decision → verify iOS new + old arch.
- **Phase 3 — cleanup + polish**: leftover checklist, `files[]`, version bump, README compatibility matrix, real jest test.
- **Phase 4 — full matrix**: all 8 checks incl. optional RN 0.85.

## Top risks
1. Android backward-compat build — extending generated spec should compile both arch via the react gradle plugin; fallback is the documented `src/oldarch` + `src/newarch` source-set split (sanctioned, not a leftover). Validate early.
2. Codegen strictness on `Object`/nullable params — `undefined → null` normalization must be correct.
3. iOS ObjC++ port — re-expressing the Swift SDK calls in ObjC++ against the Swift `AccountProtection` framework.
4. Min-RN floor bump — the only consumer-facing break; document + major version.

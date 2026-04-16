# React Native - Transmit Security Account Protection SDK
#### Detect risk in customer interactions on digital channels, and enable informed identity and trust decisions across the consumer experience.

## About Account Protection SDK
The React Native Detection and Response SDK Wrapper is a versatile tool designed to seamlessly integrate the powerful capabilities of the Detection and Response services into your React Native applications. By encapsulating the APIs of the native SDKs for both iOS and Android platforms, this wrapper empowers enterprises to confidently enhance security measures while maintaining a smooth user experience.

Using this module, you can easily integrate our Account Protection SDK into your React Native app.<br>
[Learn more on our website.](https://developer.transmitsecurity.com/guides/risk/overview/)

## Understand the flows
We recommended that you read more about the native Account Protection SDKs as described in our [iOS documentation](https://developer.transmitsecurity.com/guides/risk/quick_start_ios/) and [Android documentation](https://developer.transmitsecurity.com/guides/risk/quick_start_android/)

## Configure your app
To integrate this module, you'll need to configure an application in our [portal](https://portal.transmitsecurity.io/applications).

## Example project setup
1. In your project, navigate to `example/src/config.ts` and configure the clientId and secret using the configuration obtained from the Transmit portal.
2. Ensure you have all the necessary dependencies by running `yarn` in both the module's root folder and the example root folder.
3. Run the example app on a real device using Xcode or Android Studio. Alternatively, execute `yarn example ios` or `yarn example android`.
<br><br>
> **Important Security Note: Never store your `secret` in a front-end application.**
>
> The example app utilizes a mock server to manage communication with the authentication platform. This mock server employs the `secret` you have specified in `example/src/config.ts` exclusively for demonstration purposes. It is paramount that you safeguard your `secret` in a secure and confidential location.

## Installation

```sh
npm install react-native-ts-accountprotection
```
#### iOS Setup
You might need to execute `pod install` in your project's `/ios` folder.

#### Android Setup

Add to `app/build.gradle` under repositories

```gradle
repositories {
  google()
  maven {
    url('https://transmit.jfrog.io/artifactory/transmit-security-gradle-release-local/')
  }
}

dependencies {
  implementation("com.ts.sdk:accountprotection:3.0.0")
}
```

## Module Setup

### Initialize the Android SDK
First, [update your](https://developer.transmitsecurity.com/guides/risk/quick_start_android/#step-3-initialize-sdk) `strings.xml` by adding
```xml
<resources>
    <!-- Transmit Security Credentials -->
    <string name="transmit_security_client_id">CLIENT_ID</string>
    <string name="transmit_security_base_url">https://api.transmitsecurity.io/risk-collect/</string>
</resources>
```

Next open your `MainApplication.kt` file in your React Native `android` project, and add:

```kt
class Application : Application() {
  override fun onCreate() {
    super.onCreate()
    TSAccountProtection.initializeSDK(this.applicationContext) // initialize the SDK
      ...
  }
}
```

### Initialize the iOS SDK
First, [Create](https://developer.transmitsecurity.com/guides/risk/quick_start_ios/#step-3-initialize-sdk) a filed named `TransmitSecurity.plist` in your native iOS Xcode project:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>credentials</key>
	<dict>
		<key>baseUrl</key>
		<string>https://api.transmitsecurity.io/risk-collect/</string>
		<key>clientId</key>
		<string>[CLIENT_ID]</string>
	</dict>
</dict>
</plist>
```

Next initialize the SDK when your app component is ready (choose one of the following options):

**Option 1: Basic initialization (uses TransmitSecurity.plist configuration)**
```js
import { initializeSDKIOS } from 'react-native-ts-accountprotection';

componentDidMount(): void {
    await initializeSDKIOS();
}
```

**Option 2: Advanced initialization with custom parameters**
```js
import { initializeIOS } from 'react-native-ts-accountprotection';

componentDidMount(): void {
    await initializeIOS(
        "your-client-id", 
        "https://api.transmitsecurity.io/risk-collect/", // ⚠️ CRITICAL: Must include /risk-collect/ postfix
        {
            enableTrackingBehavioralData: true,
            enableLocationEvents: true // Enable location tracking on iOS
        },
        "optional-user-id" // Optional: Set user ID during initialization
    );
}
```

> **⚠️ IMPORTANT:** The `baseUrl` must include the `/risk-collect/` postfix (e.g., `https://api.transmitsecurity.io/risk-collect/`) or the server connection will fail.

## Module API

### Behavioral Data Collection

**Important:** To enable behavioral data collection, add `testID` attributes to UI elements you want to track:

```jsx
// Example: Add testID to trackable elements
<TouchableOpacity 
  testID="login-button"
  onPress={handleLogin}
>
  <Text>Login</Text>
</TouchableOpacity>

<TextInput
  testID="username-input"
  placeholder="Username"
  value={username}
  onChangeText={setUsername}
/>
```

**Note:** Elements without `testID` attributes will not be included in behavioral data collection.

#### Set UserID after authentication
```js
import { setAuthenticatedUser } from 'react-native-ts-accountprotection';

// Basic usage
await setAuthenticatedUser(username);

// With optional parameters
await setAuthenticatedUser(username, { 
  customProperty: 'value',
  additionalData: 123 
});
```

#### Trigger Action
```js
import { triggerAction, TSAction, TSClaimedUserIdType } from 'react-native-ts-accountprotection';

private handleTriggerActionLoginExample = async () => {
  const triggerActionResponse = await triggerAction(
    TSAction.login,
    { 
      correlationId: "CORRELATION_ID", 
      claimUserId: "CLAIM_USER_ID", // @deprecated - use claimedUserId instead
      claimedUserId: "user@example.com",
      claimedUserIdType: TSClaimedUserIdType.email,
      referenceUserId: "REFERENCE_USER_ID", 
      transactionData: undefined
    },
    undefined, // locationConfig (optional)
    { // customAttributes (optional)
      userLevel: "premium",
      sessionId: "sess_12345",
      deviceFingerprint: "fp_abcdef"
    }
  )
  const actionToken = triggerActionResponse.actionToken;
  console.log("Action Token: ", actionToken); // Use the action token to invoke the recommendation API.
}
```

**Available TSClaimedUserIdType options:**
- `TSClaimedUserIdType.email` - Email address
- `TSClaimedUserIdType.username` - Username
- `TSClaimedUserIdType.phoneNumber` - Phone number
- `TSClaimedUserIdType.accountId` - Account ID
- `TSClaimedUserIdType.ssn` - Social Security Number
- `TSClaimedUserIdType.nationalId` - National ID
- `TSClaimedUserIdType.passportNumber` - Passport number
- `TSClaimedUserIdType.driversLicenseNumber` - Driver's license number
- `TSClaimedUserIdType.other` - Other identifier type

**Custom Attributes (Optional):**
The `triggerAction` method accepts an optional `customAttributes` parameter that allows you to pass additional contextual data:

```js
// Example with custom attributes
await triggerAction(
  TSAction.transaction,
  {
    claimedUserId: "user@example.com",
    claimedUserIdType: TSClaimedUserIdType.email,
    transactionData: {
      amount: 100.00,
      currency: "USD"
    }
  },
  undefined, // locationConfig
  { // customAttributes
    userLevel: "premium",
    deviceType: "mobile",
    sessionDuration: 1800,
    previousTransactionCount: 5,
    riskScore: 0.2
  }
);
```

The `customAttributes` object can contain any key-value pairs relevant to your risk assessment needs.

**Location Configuration (Optional):**
The `triggerAction` method accepts an optional `locationConfig` parameter to control location data collection:

```js
import { triggerAction, TSAction } from 'react-native-ts-accountprotection';

// Example with location configuration
await triggerAction(
  TSAction.login,
  {
    claimedUserId: "user@example.com",
    claimedUserIdType: TSClaimedUserIdType.email
  },
  { // locationConfig
    mode: "lastKnown", // Options: "disabled", "default", "forceCurrent", "forceLastKnown", "lastKnown"
    validFor: 300 // For "lastKnown" mode: return location only if not older than 300 minutes
  }
);
```

#### Clear User ID
```js
import { clearUser } from 'react-native-ts-accountprotection';

await clearUser();
```

#### Get Session Token
Retrieve the current session token for the authenticated user:
```js
import { getSessionToken } from 'react-native-ts-accountprotection';

const sessionToken = await getSessionToken();
console.log("Session Token: ", sessionToken);
```

#### Log Page Load
Track page navigation events:
```js
import { logPageLoad } from 'react-native-ts-accountprotection';

await logPageLoad("login-page");
await logPageLoad("dashboard");
await logPageLoad("checkout");
```

#### Set Log Level (Optional)
Enable or disable SDK debug logging:
```js
import { setLogLevel } from 'react-native-ts-accountprotection';

await setLogLevel(true);  // Enable debug logging
await setLogLevel(false); // Disable debug logging
```

## Important
Please take note that the example application uses a client-side mock server. In a production environment, a real server is required. Additionally, it is crucial to emphasize that storing the client secret in your front-end application is strictly discouraged for security reasons.

## Support
[Email us for support](info@transmitsecurity.com)

## Author

Transmit Security, https://github.com/TransmitSecurity

## License

This project is licensed under the MIT license. See the LICENSE file for more info.

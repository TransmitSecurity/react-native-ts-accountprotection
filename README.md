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
  implementation("com.ts.sdk:accountprotection:2.1.+")
}
```

## Module Setup

### Initialize the Android SDK
First, [update your](https://developer.transmitsecurity.com/guides/risk/quick_start_android/#step-3-initialize-sdk) `strings.xml` by adding
```xml
<resources>
    <!-- Transmit Security Credentials -->
    <string name="transmit_security_client_id">"CLIENT_ID"</string>
    <string name="transmit_security_base_url">https://api.transmitsecurity.io/</string>
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
		<string>https://api.transmitsecurity.io/</string>
		<key>clientId</key>
		<string>[CLIENT_ID]</string>
	</dict>
</dict>
</plist>
```

Next initialize the SDK when your app component is ready
```js
import { initializeSDKIOS } from 'react-native-ts-accountprotection';

componentDidMount(): void {
    // Setup the module as soon your component is ready
    await initializeSDKIOS();
}
```

## Module API

#### Set UserID after authentication
```js
import { setUserId } from 'react-native-ts-accountprotection';

await setUserId(username);
```

#### Trigger Action
```js
import { triggerAction, TSAction } from 'react-native-ts-accountprotection';

private handleTriggerActionLoginExample = async () => {
  const triggerActionResponse = await triggerAction(
    TSAction.login,
    { 
      correlationId: "CORRELATION_ID", 
      claimUserId: "CLAIM_USER_ID", 
      referenceUserId: "REFERENCE_USER_ID", 
      transactionData: undefined
    }
  )
  const actionToken = triggerActionResponse.actionToken;
  console.log("Action Token: ", actionToken); // Use the action token to invoke the recommendation API.
}
```

#### Clear User ID
```js
import { clearUser } from 'react-native-ts-accountprotection';

await clearUser();
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

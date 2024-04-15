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
```


## Module Setup and API

#### Initialize the SDK
### There are two methods to init the SDK module, iOS can use both, Android needs to call initializeSDK on Application.onCreate()

### Android
```kt
override fun onCreate() {
    super.onCreate()
    TSAccountProtection.initializeSDK(this.applicationContext)
    ...
  }
```

### iOS

## Option 1: initializeSDK()
# Inthis options the client_id and base_url are predefined in the module plis/strings.xml and axcsible to the sdk
```js
import TSAccountProtectionSDKModule, { TSAccountProtectionSDK } from 'react-native-ts-accountprotection';

componentDidMount(): void {
    // Setup the module as soon your component is ready
    await TSAccountProtectionSDKModule.initializeSDK(); 
}
```

## Option 1: initialize('REPLACE_WITH_CLIENT_ID')
# In this option client_id is passed as a variable from the application level to the native module
```js
import TSAccountProtectionSDKModule, { TSAccountProtectionSDK } from 'react-native-ts-accountprotection';

componentDidMount(): void {
    // Setup the module as soon your component is ready
    await TSAccountProtectionSDKModule.initialize('REPLACE_WITH_CLIENT_ID');
}
```

#### Set UserID after authentication
```js
await TSAccountProtectionSDKModule.setUserId(username);
```

#### Trigger Action
```js
private invokeTriggerAction = async () => {
    const options: TSAccountProtectionSDK.TSActionEventOptions = {
      transactionData: {
        amount: 500,
        currency: 'USD',
        payer: { name: 'Payer' }, payee: { name: 'Payee' }
      }
    };

    try {
      const triggerActionResponse = await TSAccountProtectionSDKModule.triggerAction(
        `${TSAccountProtectionSDK.TSAction.transaction}`,
        options
      );

      // Fetch recommendation using `triggerActionResponse.actionToken`
    } catch (error) {
      // handle error
    }
  }
```

#### Clear User ID
```js
await TSAccountProtectionSDKModule.clearUser();
```

## Important
Please take note that the example application uses a client-side mock server. In a production environment, a real server is required. Additionally, it is crucial to emphasize that storing the client secret in your front-end application is strictly discouraged for security reasons.

## Support
[Email us for support](info@transmitsecurity.com)

## Author

Transmit Security, https://github.com/TransmitSecurity

## License

This project is licensed under the MIT license. See the LICENSE file for more info.

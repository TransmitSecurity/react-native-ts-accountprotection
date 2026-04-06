import * as React from 'react';

import { SafeAreaView, Keyboard, Alert, Platform } from 'react-native';

import { 
  initializeSDKIOS,
  initializeIOS,
  setAuthenticatedUser,
  setLogLevel,
  clearUser, 
  getSessionToken,
  triggerAction, 
  TSAction, 
  TSClaimedUserIdType,
  type TSActionEventOptions, 
  type TSLocationConfig,
  logPageLoad
} from 'react-native-ts-accountprotection';
import MockServer from './mock-server';

import Login from './screens/login';
import { AuthenticatedUser } from './screens/authenticated-user';
import LoadingScreen from './screens/loading';
import config from './config';

export type MoneyTransferDTO = {
  payerName: string;
  payeeName: string;
  amount: string;
}

export type State = {
  currentScreen: AppScreen;
  errorMessage: string;
  isLoading: boolean;
};

export type Props = {

};

const enum AppScreen {
  Login = 'Login',
  AuthenticatedUser = 'AuthenticatedUser'
}

export default class App extends React.Component<Props, State> {

  private mockServer = new MockServer(config.baseUrl, config.clientId, config.secret);

  constructor(props: Props) {
    super(props);
    this.state = {
      currentScreen: AppScreen.Login,
      errorMessage: "",
      isLoading: false
    };
  }

  componentDidMount(): void {
    this.onAppReady().catch(e => void e);
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {
          this.state.currentScreen === AppScreen.Login ? (
            <Login onLogin={this.handleLogin} errorMessage={this.state.errorMessage} />
          ) : (
            <AuthenticatedUser
              onSubmitMoneyTransferRequest={this.handleSubmitMoneyTransferRequest}
              onLogout={this.onLogout}
              userId={config.demoUserId}
            />
          )
        }
        <LoadingScreen isLoading={this.state.isLoading} />
      </SafeAreaView>
    );
  }

  // App Configuration

  private onAppReady = async (): Promise<void> => {
    // this is for iOS only, Android TSAccountProtectionSDK is initialized from application onCreate.
    if (Platform.OS === 'ios') {
      await initializeIOS(config.clientId, config.baseUrl, {
        enableTrackingBehavioralData: true,
        enableLocationEvents: true
      });
      // await initializeSDKIOS();
    }

    const isLogEnabled = true;
    await setLogLevel(isLogEnabled);
  }

  // Authentication

  private handleLogin = async (username: string, password: string) => {
    Keyboard.dismiss()
    this.setState({ isLoading: true });
    
    setTimeout(async () => {
      try {
        console.log('[App] Testing setAuthenticatedUser after login...');
        await setAuthenticatedUser(username);
        console.log('[App] setAuthenticatedUser() completed successfully for user:', username);
        console.log('[App] Testing getSessionToken after login...');
        const sessionToken = await getSessionToken();
        console.log('[App] getSessionToken() completed successfully:', sessionToken);
      } catch (error) {
        console.error('[App] Error getting session token after login:', error);
      }
      
      this.navigateToAuthenticatedUserScreen();
    }, 1500);
  };

  private navigateToAuthenticatedUserScreen = () => {
    this.setState({
      isLoading: false,
      currentScreen: AppScreen.AuthenticatedUser
    });
    logPageLoad('AuthenticatedUserScreen');
  }

  // Logout, Clear User

  private onLogout = async () => {
    Keyboard.dismiss()
    this.setState({ isLoading: true });
    
    try {
      const clearResult = await clearUser();
      console.log('[App] clearUser() completed successfully:', clearResult);
    } catch (error) {
      console.error('[App] Error during logout process:', error);
    }
    
    console.log('[App] Logout process completed, returning to login screen');
    this.setState({
      isLoading: false,
      currentScreen: AppScreen.Login
    });
    logPageLoad('LoginScreen');
  }

  // Money Transfer

  private handleSubmitMoneyTransferRequest = async (requestDTO: MoneyTransferDTO) => {
    Keyboard.dismiss()
    this.setState({ isLoading: true });

    const locationConfig: TSLocationConfig = {
      mode: 'lastKnown' as const,
      validFor: 300
    };

    try {
      // Custom attributes for additional context
      const customAttributes = {
        deviceId: 'mobile-app-v1.0',
        sessionId: Date.now().toString(),
        userAgent: Platform.OS,
        appVersion: '1.0.0',
        transactionCategory: 'money-transfer',
        riskLevel: 'medium'
      };

      const triggerActionResponse = await triggerAction(
        `${TSAction.transaction}`,
        this.convertMoneyTransferDTOToEventOptions(requestDTO),
        locationConfig,
        customAttributes
      );

      const recommendationResponse = await this.mockServer.fetchRecommendation(triggerActionResponse.actionToken);
      console.log("Server returned recomendation for action:");
      console.log(recommendationResponse);
      Alert.alert("Recommendation Received", JSON.stringify(recommendationResponse));

      const recomendation = recommendationResponse.recommendation;
      if (recomendation) {
        const message = `Recommendation: ${recomendation.type} | Risk Score: ${recommendationResponse.risk_score}`;
        Alert.alert("Recommendation Received", message);
      }

      this.setState({ errorMessage: "", isLoading: false });

    } catch (error) {
      this.setState({ errorMessage: `${error}`, isLoading: false });
    }
  }

  private convertMoneyTransferDTOToEventOptions = (requestDTO: MoneyTransferDTO): TSActionEventOptions => {
    const options: TSActionEventOptions = {
      correlationId: `transfer-${Date.now()}`,
      claimedUserId: config.demoUserId,
      claimedUserIdType: TSClaimedUserIdType.username,
      referenceUserId: 'demo-reference-user',
      transactionData: {
        amount: parseFloat(requestDTO.amount),
        currency: 'USD',
        reason: 'Money transfer between users',
        transactionDate: Date.now(),
        payer: {
          name: requestDTO.payerName,
          branchIdentifier: 'PAYER_BRANCH_001',
          accountNumber: '****1234'
        },
        payee: {
          name: requestDTO.payeeName,
          bankIdentifier: 'DEMO_BANK_002',
          branchIdentifier: 'BRANCH_456',
          accountNumber: '****5678'
        }
      }
    };
    return options;
  }
}

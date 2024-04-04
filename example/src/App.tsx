import * as React from 'react';

import { SafeAreaView, Keyboard, Alert } from 'react-native';

import TSAccountProtectionSDKModule, { TSAccountProtectionSDK } from 'react-native-ts-accountprotection';
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
    await TSAccountProtectionSDKModule.initialize(config.clientId);
  }

  // Authentication

  private handleLogin = async (username: string, password: string) => {
    Keyboard.dismiss()
    this.setState({ isLoading: true });
    await TSAccountProtectionSDKModule.setUserId(username);

    setTimeout(async () => {
      this.navigateToAuthenticatedUserScreen();
    }, 1500);
  };

  private navigateToAuthenticatedUserScreen = () => {
    this.setState({
      isLoading: false,
      currentScreen: AppScreen.AuthenticatedUser
    });
  }

  // Logout, Clear User

  private onLogout = async () => {
    Keyboard.dismiss()
    this.setState({ isLoading: true });
    await TSAccountProtectionSDKModule.clearUser();
    this.setState({
      isLoading: false,
      currentScreen: AppScreen.Login
    });
  }

  // Money Transfer

  private handleSubmitMoneyTransferRequest = async (requestDTO: MoneyTransferDTO) => {
    Keyboard.dismiss()
    this.setState({ isLoading: true });

    try {
      const triggerActionResponse = await TSAccountProtectionSDKModule.triggerAction(
        `${TSAccountProtectionSDK.TSAction.transaction}`,
        this.convertMoneyTransferDTOToEventOptions(requestDTO)
      );

        const recommendationResponse = await this.mockServer.fetchRecommendation(triggerActionResponse.actionToken);        
        console.log("Server returned recomendation for action:");
        console.log(recommendationResponse);
        
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

  private convertMoneyTransferDTOToEventOptions = (requestDTO: MoneyTransferDTO): TSAccountProtectionSDK.TSActionEventOptions => {
    const options: TSAccountProtectionSDK.TSActionEventOptions = {
      transactionData: {
        amount: parseFloat(requestDTO.amount),
        currency: 'USD',
        payer: {
          name: requestDTO.payerName
        },
        payee: {
          name: requestDTO.payeeName
        }
      }
    };
    return options;
  }
}
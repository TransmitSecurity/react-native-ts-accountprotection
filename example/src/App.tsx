import * as React from 'react';

import { SafeAreaView, Keyboard } from 'react-native';

// import { multiply } from 'react-native-ts-accountprotection';
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

  }

  // Authentication

  private handleLogin = (username: string, password: string) => {
    Keyboard.dismiss()
    this.setState({ isLoading: true });

    setTimeout(() => {
      this.setState({ 
        isLoading: false, 
        currentScreen: AppScreen.AuthenticatedUser
      });
    }, 1500);
  };

  // Money Transfer

  private handleSubmitMoneyTransferRequest = (requestDTO: MoneyTransferDTO) => {
    Keyboard.dismiss()
    this.setState({ isLoading: true });

    setTimeout(() => {
      this.setState({ 
        isLoading: false
      });
    }, 1500);
  }
}
import React, { type ReactElement } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import config from '../config';

interface LoginProps { 
    onLogin: (username: string, password: string) => void;
    errorMessage: string;
}

interface LoginState {
    username: string;
    password: string;
}

export default class Login extends React.Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);
        this.state = {
            username: config.demoUserId,
            password: config.demoUserPassword,
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ marginTop: 20 }} />
                <Text style={styles.sectionTitle}>{"DRS Example"}</Text>
                {this.renderCredentialFields()}
                {this.renderLoginButton()}
                {this.renderStatusLabel()}
            </View>
        );
    }

    private renderCredentialFields(): ReactElement {
        return (
            <View style={{ marginTop: 24 }}>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({ username: text })}
                    value={this.state.username}
                    placeholder="Type your username here"
                    editable={false} selectTextOnFocus={false}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({ password: text })}
                    value={this.state.password}
                    placeholder="Type your password here"
                    editable={false} selectTextOnFocus={false}
                />
            </View>
        )
    }

    private renderLoginButton(): ReactElement {
        return (
            <View style={{ marginTop: 24 }}>
                <Button
                    title="Login"
                    onPress={() => this.props.onLogin(this.state.username, this.state.password)}
                />
            </View>
        )
    }

    private renderStatusLabel(): ReactElement {
        return (
            <View style={{ marginTop: 24 }}>
                <Text style={styles.statusLabel}>{this.props.errorMessage}</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 12,
    },
    statusLabel: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        color: 'red',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        color: 'black',
    },
    sectionDescription: {
        marginTop: 40,
        marginBottom: 10,
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center',
        color: 'black',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
    },
});
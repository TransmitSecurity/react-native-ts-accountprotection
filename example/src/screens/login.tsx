import React, { type ReactElement } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
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
                <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" translucent={false} />
                
                {/* Header with Bank Branding */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <View style={styles.logoIcon}>
                            <Text style={styles.logoText}>🏦</Text>
                        </View>
                        <Text style={styles.bankName}>SecureBank</Text>
                        <Text style={styles.bankSubtitle}>Digital Banking Platform</Text>
                    </View>
                </View>

                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeTitle}>Welcome Back</Text>
                    <Text style={styles.welcomeSubtitle}>Please sign in to your account</Text>
                </View>

                {/* Login Form */}
                <View style={styles.formContainer}>
                    {this.renderCredentialFields()}
                    {this.renderLoginButton()}
                    {this.renderStatusLabel()}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Protected by Transmit Security
                    </Text>
                    <Text style={styles.footerSubText}>
                        Your security is our priority
                    </Text>
                </View>
            </View>
        );
    }

    private renderCredentialFields(): ReactElement {
        return (
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Username</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.setState({ username: text })}
                        value={this.state.username}
                        placeholder="Enter your username"
                        placeholderTextColor="#9ca3af"
                        editable={false} 
                        selectTextOnFocus={false}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.setState({ password: text })}
                        value={this.state.password}
                        placeholder="Enter your password"
                        placeholderTextColor="#9ca3af"
                        secureTextEntry={true}
                        editable={false} 
                        selectTextOnFocus={false}
                    />
                </View>
            </View>
        )
    }

    private renderLoginButton(): ReactElement {
        return (
            <TouchableOpacity
                style={styles.loginButton}
                onPress={() => this.props.onLogin(this.state.username, this.state.password)}
                activeOpacity={0.8}
            >
                <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
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
        backgroundColor: '#f8fafc',
    },
    header: {
        backgroundColor: '#1e3a8a',
        paddingTop: 20,
        paddingBottom: 40,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    logoContainer: {
        alignItems: 'center',
    },
    logoIcon: {
        width: 80,
        height: 80,
        backgroundColor: '#3b82f6',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    logoText: {
        fontSize: 40,
    },
    bankName: {
        fontSize: 28,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 4,
    },
    bankSubtitle: {
        fontSize: 14,
        color: '#93c5fd',
        fontWeight: '400',
    },
    welcomeSection: {
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 20,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 8,
        textAlign: 'center',
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 24,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputWrapper: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        height: 56,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    loginButton: {
        backgroundColor: '#1e3a8a',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#1e3a8a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    statusLabel: {
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        color: '#ef4444',
        marginTop: 16,
        paddingHorizontal: 16,
        lineHeight: 20,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 4,
    },
    footerSubText: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'center',
    },
    // Legacy styles for compatibility
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
});
import React, { type ReactElement } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, View, ScrollView, StatusBar } from 'react-native';
import type { MoneyTransferDTO } from '../App';

interface AuthenticatedUserProps {
    onSubmitMoneyTransferRequest: (requestDTO: MoneyTransferDTO) => void;
    onLogout: () => void;

    userId: string;
}

interface AuthenticatedUserState {
    payerName: string;
    payeeName: string;
    amount: string;
}

export class AuthenticatedUser extends React.Component<AuthenticatedUserProps, AuthenticatedUserState> {

    constructor(props: AuthenticatedUserProps) {
        super(props);
        this.state = {
            payerName: props.userId,
            payeeName: '',
            amount: '',
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" translucent={false} />
                
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.welcomeText}>Welcome back</Text>
                            <Text style={styles.userName}>{this.props.userId}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={() => this.props.onLogout()}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.logoutButtonText}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Account Overview */}
                    <View style={styles.accountCard}>
                        <Text style={styles.cardTitle}>Account Balance</Text>
                        <Text style={styles.balanceAmount}>$12,450.67</Text>
                        <Text style={styles.accountNumber}>Checking •••• 4521</Text>
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.quickActionsContainer}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                        <View style={styles.quickActionsGrid}>
                            <View style={styles.quickActionItem}>
                                <View style={styles.quickActionIcon}>
                                    <Text style={styles.quickActionEmoji}>💸</Text>
                                </View>
                                <Text style={styles.quickActionText}>Transfer</Text>
                            </View>
                            <View style={styles.quickActionItem}>
                                <View style={styles.quickActionIcon}>
                                    <Text style={styles.quickActionEmoji}>💳</Text>
                                </View>
                                <Text style={styles.quickActionText}>Pay Bills</Text>
                            </View>
                            <View style={styles.quickActionItem}>
                                <View style={styles.quickActionIcon}>
                                    <Text style={styles.quickActionEmoji}>📊</Text>
                                </View>
                                <Text style={styles.quickActionText}>Analytics</Text>
                            </View>
                            <View style={styles.quickActionItem}>
                                <View style={styles.quickActionIcon}>
                                    <Text style={styles.quickActionEmoji}>⚙️</Text>
                                </View>
                                <Text style={styles.quickActionText}>Settings</Text>
                            </View>
                        </View>
                    </View>

                    {/* Money Transfer Form */}
                    <View style={styles.transferCard}>
                        <Text style={styles.cardTitle}>Send Money</Text>
                        <Text style={styles.cardSubtitle}>Transfer funds securely with fraud protection</Text>
                        {this.renderInputFields()}
                        {this.renderSubmitButton()}
                    </View>
                </ScrollView>
            </View>
        );
    }

    private renderSubmitButton(): ReactElement {
        return (
            <TouchableOpacity
                style={styles.transferButton}
                onPress={() => this.hadnleSubmit()}
                activeOpacity={0.8}
            >
                <Text style={styles.transferButtonText}>🔒 Send Money Securely</Text>
            </TouchableOpacity>
        )
    }

    private renderInputFields(): ReactElement {
        return (
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>From</Text>
                    <TextInput
                        style={styles.input}
                        value={this.state.payerName}
                        onChangeText={(text) => this.setState({ payerName: text })}
                        placeholder="Your account name"
                        placeholderTextColor="#9ca3af"
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>To</Text>
                    <TextInput
                        style={styles.input}
                        value={this.state.payeeName}
                        onChangeText={(text) => this.setState({ payeeName: text })}
                        placeholder="Recipient's name"
                        placeholderTextColor="#9ca3af"
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Amount (USD)</Text>
                    <TextInput
                        style={styles.input}
                        value={this.state.amount}
                        onChangeText={(text) => this.setState({ amount: text })}
                        placeholder="0.00"
                        placeholderTextColor="#9ca3af"
                        keyboardType="numeric"
                    />
                </View>
            </View>
        )
    }

    private hadnleSubmit = () => {

        let payerName = this.state.payerName;
        let payeeName = this.state.payeeName;
        let amount = this.state.amount;

        if (payerName === '') payerName = 'Demo Payer';
        if (payeeName === '') payeeName = 'Demo Payee';
        if (amount === '') amount = '100';

        const dto: MoneyTransferDTO = {
            payerName: payerName,
            payeeName: payeeName,
            amount: amount
        };
        
        this.props.onSubmitMoneyTransferRequest(dto);
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        backgroundColor: '#1e3a8a',
        paddingTop: 20,
        paddingBottom: 24,
        paddingHorizontal: 24,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    welcomeText: {
        color: '#93c5fd',
        fontSize: 14,
        fontWeight: '400',
    },
    userName: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '700',
        marginTop: 4,
    },
    logoutButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    logoutButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    accountCard: {
        backgroundColor: '#ffffff',
        marginHorizontal: 24,
        marginTop: -20,
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 8,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#9ca3af',
        marginBottom: 20,
        lineHeight: 20,
    },
    balanceAmount: {
        fontSize: 36,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 8,
    },
    accountNumber: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500',
    },
    quickActionsContainer: {
        paddingHorizontal: 24,
        paddingTop: 32,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    quickActionItem: {
        width: '22%',
        alignItems: 'center',
        marginBottom: 16,
    },
    quickActionIcon: {
        width: 50,
        height: 50,
        backgroundColor: '#e0e7ff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickActionEmoji: {
        fontSize: 20,
    },
    quickActionText: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
        textAlign: 'center',
    },
    transferCard: {
        backgroundColor: '#ffffff',
        marginHorizontal: 24,
        marginTop: 24,
        marginBottom: 32,
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
    },
    inputContainer: {
        marginTop: 16,
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
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        color: '#1f2937',
    },
    transferButton: {
        backgroundColor: '#1e3a8a',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        shadowColor: '#1e3a8a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    transferButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    // Legacy styles for compatibility
    statusLabel: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        color: 'black',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 4,
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
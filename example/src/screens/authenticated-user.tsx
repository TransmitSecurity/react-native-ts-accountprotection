import React, { type ReactElement } from 'react';
import { Text, TextInput, Button, StyleSheet, View } from 'react-native';
import type { MoneyTransferDTO } from '../App';

interface AuthenticatedUserProps {
    onSubmitMoneyTransferRequest: (requestDTO: MoneyTransferDTO) => void;

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
                <View style={{ marginTop: 20 }} />
                <Text style={styles.sectionTitle}>{"DRS Example"}</Text>
                {this.renderHeading()}
                {this.renderInputFields()}
                {this.renderSubmitButton()}
            </View>
        );
    }

    private renderSubmitButton(): ReactElement {
        return (
            <View style={{ marginTop: 24 }}>
                <Button
                    title="Submit"
                    onPress={() => this.hadnleSubmit()}
                />
            </View>
        )
    }

    private renderHeading(): ReactElement {
        return (
            <View style={{ marginTop: 24 }}>
                <Text style={styles.statusLabel}>Money Transfer</Text>
            </View>
        )
    }

    private renderInputFields(): ReactElement {
        return (
            <View style={{ padding: 24 }}>
                <TextInput
                    style={styles.input}
                    value={this.state.payerName}
                    onChangeText={(text) => this.setState({ payerName: text })}
                    placeholder="Payer Name"
                    autoFocus={true}
                />
                <TextInput
                    style={styles.input}
                    value={this.state.payeeName}
                    onChangeText={(text) => this.setState({ payeeName: text })}
                    placeholder="Payee Name"
                />
                <TextInput
                    style={styles.input}
                    value={this.state.amount}
                    onChangeText={(text) => this.setState({ amount: text })}
                    placeholder="Amount (USD)"
                    keyboardType="numeric"
                />  
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
        justifyContent: 'flex-start',
        padding: 12,
    },
    statusLabel: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        color: 'black',
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
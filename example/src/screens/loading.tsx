import React, { type ReactElement } from 'react';

import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingScreenProps {
    isLoading: boolean;
}

export default class LoadingScreen extends React.Component<LoadingScreenProps> {
    render() {
        const { isLoading } = this.props;
        
        if (!isLoading) {
            return this.renderNonLoadingScreen();
        }

        return (
            <View style={[StyleSheet.absoluteFill, styles.overlay]}>
                {isLoading && (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#ffffff" />
                    </View>
                )}
            </View>
        );
    }

    private renderNonLoadingScreen(): ReactElement {
        return <View />;
    }
}

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    loaderContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 10,
        padding: 20,
    },
});

import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';

interface ScreenBackgroundProps extends ViewProps { }

const ScreenBackground = ({ children, style }: ScreenBackgroundProps) => {
    const isGradient = Array.isArray(COLORS.backgroundGradient);

    if (isGradient) {
        return (
            <LinearGradient
                colors={COLORS.backgroundGradient}
                style={[styles.container, style]}
            >
                {children}
            </LinearGradient>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: COLORS.background }, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ScreenBackground;
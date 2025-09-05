import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import ScreenBackground from '../../components/common/ScreenBackground';

export default function FavoritesScreen() {
    return (
        <ScreenBackground style={styles.container}>
            <Text style={styles.title}>Imóveis Salvos</Text>
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
});
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function FavoritesScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Imóveis Salvos</Text>
        </View>
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
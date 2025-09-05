import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import ScreenBackground from '../../components/common/ScreenBackground';

export default function ProfileScreen() {
    return (
        <ScreenBackground style={styles.container}>
            <Text style={styles.title}>Meu Perfil</Text>
            {/* Aqui entrarão as informações do perfil do usuário */}
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
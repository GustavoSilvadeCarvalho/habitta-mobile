import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ScreenBackground from '../../components/common/ScreenBackground';
import { COLORS } from '../../constants/colors';

export default function ExploreChoiceScreen({ navigation }: any) {
    return (
        <ScreenBackground style={styles.container}>
            <Text style={styles.title}>Ir para:</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('ExploreMain')}
            >
                <Text style={styles.buttonText}>Explorar</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Sales')}
            >
                <Text style={styles.buttonText}>Vendas</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Rent')}
            >
                <Text style={styles.buttonText}>Aluguéis</Text>
            </TouchableOpacity>
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 80,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 24,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import useLocation from '../../hooks/useLocation';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
    const { user, logout } = useContext(AuthContext);
    const navigation = useNavigation();
    const { location, errorMsg } = useLocation();

    const renderLocation = () => {
        if (errorMsg) {
            return <Text style={styles.locationText}>{errorMsg}</Text>;
        }
        if (location) {
            return (
                <View style={styles.locationContainer}>
                    <Ionicons name="location-sharp" size={16} color={COLORS.white} />
                    <Text style={styles.locationText}> {location}</Text>
                </View>
            );
        }
        return <ActivityIndicator color={COLORS.white} />; // Mostra um "loading" enquanto busca
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo(a), {user?.name}!</Text>
            {renderLocation()}
            <View style={styles.buttonContainer}>
                <Button
                    title="Ver Meu Perfil"
                    onPress={() => navigation.navigate('Profile')}
                />
            </View>

            <Button title="Sair" onPress={logout} color={COLORS.secondary} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20
    },
    buttonContainer: {
        marginVertical: 10
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Um fundo semi-transparente
    },
    locationText: {
        fontSize: 16,
        color: COLORS.text,
    }
});
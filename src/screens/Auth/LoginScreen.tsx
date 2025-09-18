import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/colors';

export default function LoginScreen() {
    console.log('Renderizando LoginScreen');
    const [email, setEmail] = useState('teste@email.com');
    const [password, setPassword] = useState('123');
    const { login, isLoading } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erro", "Por favor, preencha ambos os campos.");
            return;
        }
        try {
            await login(email, password);
        } catch (error: any) {
            Alert.alert("Erro de Login", error.message);
        }
    };

    console.log('LoginScreen: isLoading', isLoading);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Habitta Mobile</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {isLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
                <Button title="Entrar" onPress={handleLogin} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: COLORS.background },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    input: { height: 40, borderColor: COLORS.gray, borderWidth: 1, marginBottom: 12, paddingHorizontal: 10, borderRadius: 5, backgroundColor: COLORS.white },
});
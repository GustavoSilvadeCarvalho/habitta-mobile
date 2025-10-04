import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ImageBackground, ActivityIndicator, Alert } from 'react-native';
import { COLORS } from '../../constants/colors';

import { StackNavigationProp } from '@react-navigation/stack';

type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

type RegisterScreenProps = {
    navigation: StackNavigationProp<AuthStackParamList, 'Register'>;
};

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPasswordRules, setShowPasswordRules] = useState(false);

    const hasUpper = (pwd: string) => /[A-Z]/.test(pwd);
    const hasLower = (pwd: string) => /[a-z]/.test(pwd);
    const hasNumber = (pwd: string) => /[0-9]/.test(pwd);
    const hasSpecial = (pwd: string) => /[^A-Za-z0-9]/.test(pwd);
    const hasLength = (pwd: string) => pwd.length >= 8;
    const isStrongPassword = (pwd: string) => hasUpper(pwd) && hasLower(pwd) && hasNumber(pwd) && hasSpecial(pwd) && hasLength(pwd);

    const handleRegister = async () => {
        setError('');
        if (!name || !email || !phone || !password || !confirmPassword) {
            setError('Preencha todos os campos.');
            return;
        }
        if (password !== confirmPassword) {
            setError('As senhas não conferem.');
            return;
        }
        if (!isStrongPassword(password)) {
            setError('A senha deve ter pelo menos 8 caracteres, incluindo 1 número, 1 caracter especial, 1 letra maiúscula e 1 letra minúscula.');
            return;
        }
        setLoading(true);
        console.log('Iniciando cadastro...');
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort();
                setError('Tempo de resposta excedido. Tente novamente.');
                setLoading(false);
                console.log('Timeout atingido.');
            }, 10000);

            const response = await fetch('https://habitta-mobile.onrender.com/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, password, confirmPassword }),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            console.log('Resposta recebida:', response.status);
            const data = await response.json();
            console.log('Dados da resposta:', data);
            if (response.ok) {
                Alert.alert('Sucesso', 'Cadastro realizado!');
                navigation.navigate('Login');
            } else {
                setError(data.error || 'Erro ao cadastrar.');
                setLoading(false);
            }
        } catch (err) {
            console.log('Erro no cadastro:', err);
            if (err.name === 'AbortError') return;
            setError('Erro de conexão.');
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <Image source={require('../../assets/logo-sem-fundo.png')} style={styles.logo} resizeMode="contain" />
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome"
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor="#888"
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#888"
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Telefone</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Telefone"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholderTextColor="#888"
                    />
                </View>
                <View style={styles.inputGroup}>
                    {showPasswordRules && (
                        <View style={styles.passwordRulesDialog}>
                            <Text style={styles.passwordRuleItem}>
                                {hasLength(password) ? '✔️' : '❌'} Mínimo 8 caracteres
                            </Text>
                            <Text style={styles.passwordRuleItem}>
                                {hasNumber(password) ? '✔️' : '❌'} Pelo menos 1 número
                            </Text>
                            <Text style={styles.passwordRuleItem}>
                                {hasSpecial(password) ? '✔️' : '❌'} Pelo menos 1 caracter especial
                            </Text>
                            <Text style={styles.passwordRuleItem}>
                                {hasUpper(password) ? '✔️' : '❌'} Pelo menos 1 letra maiúscula
                            </Text>
                            <Text style={styles.passwordRuleItem}>
                                {hasLower(password) ? '✔️' : '❌'} Pelo menos 1 letra minúscula
                            </Text>
                        </View>
                    )}
                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#888"
                        onFocus={() => setShowPasswordRules(true)}
                        onBlur={() => password ? setShowPasswordRules(true) : setShowPasswordRules(false)}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirmar Senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmar Senha"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        placeholderTextColor="#888"
                    />
                </View>
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                        <Text style={styles.registerButtonText}>Cadastrar</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLinkText}>Já possui conta? Faça login</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    passwordRulesDialog: {
        position: 'absolute',
        top: -110,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.95)',
        borderRadius: 8,
        padding: 10,
        marginHorizontal: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        zIndex: 10,
    },
    passwordRulesBox: {
        backgroundColor: 'rgba(0,0,0,0.85)',
        borderRadius: 8,
        padding: 10,
        marginTop: 4,
        marginBottom: 2,
        marginHorizontal: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    passwordRuleItem: {
        color: '#fff',
        fontSize: 13,
        marginVertical: 2,
        marginLeft: 2,
        opacity: 0.95,
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 20,
        paddingTop: 60,
        backgroundColor: 'rgba(30,30,30,0.6)',
        margin: 0,
    },
    logo: {
        width: 370,
        height: 270,
        alignSelf: 'center',
    },
    inputGroup: {
        marginBottom: 12,
    },
    label: {
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 6,
        marginLeft: 2,
        fontSize: 15,
    },
    input: {
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        borderWidth: 0,
        marginBottom: 0,
        color: '#222',
    },
    error: {
        color: COLORS.secondary,
        marginBottom: 8,
        textAlign: 'center',
    },
    registerButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 8,
    },
    registerButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 0.5,
    },
    loginLink: {
        marginTop: 16,
        alignItems: 'center',
    },
    loginLinkText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

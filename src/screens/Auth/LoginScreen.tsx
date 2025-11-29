import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/colors';
import * as LocalAuthentication from 'expo-local-authentication';
import { saveCredentials, getCredentials } from '../../utils/secureStorage'; // 🔹 arquivo com as funções acima

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useContext(AuthContext);

  // 🔹 Checar se tem credenciais salvas na primeira vez que abrir
  useEffect(() => {
    (async () => {
      const creds = await getCredentials();
      if (creds) {
        // Se encontrou, pergunta se quer usar biometria
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (hasHardware && isEnrolled) {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Entrar com biometria",
            fallbackLabel: "Usar senha",
          });

          if (result.success) {
            try {
              await login(creds.email, creds.password);
            } catch (error: any) {
              Alert.alert("Erro", error.message);
            }
          }
        }
      }
    })();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha ambos os campos.");
      return;
    }
    try {
      await login(email, password);
      await saveCredentials(email, password); // 🔹 Salva para o próximo login
      Alert.alert("Sucesso", "Login realizado e credenciais salvas!");
    } catch (error: any) {
      Alert.alert("Erro de Login", error.message);
    }
  };

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

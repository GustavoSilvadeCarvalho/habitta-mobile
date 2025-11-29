import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors'; 
import ScreenBackground from '../../components/common/ScreenBackground';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }: any) {
    const { user, logout } = useContext(AuthContext);

    return (
        <ScreenBackground style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title} accessibilityRole="header">Meu Perfil</Text>

                <View style={styles.profileContent} accessible>
                    <View style={styles.profileImage} />
                    <Text style={styles.profileTextName} accessibilityLabel={`Nome do usuário: ${user?.name}`}>{user?.name}</Text>
                    <Text style={styles.profileText} accessibilityLabel={`Email do usuário: ${user?.email}`}>{user?.email}</Text>
                </View>

                <View style={styles.optionsContainer}>
                    <TouchableOpacity 
                        style={styles.optionRow} 
                        onPress={() => { /* navegar para editar info pessoais */ }}
                        accessible
                        accessibilityRole="button"
                        accessibilityLabel="Informações Pessoais"
                        accessibilityHint="Toque para editar suas informações pessoais"
                    >
                        <View style={styles.optionLeft} importantForAccessibility='no-hide-descendants'>
                            <Ionicons name="person-outline" size={26} color={COLORS.text}/>
                            <Text style={styles.optionText}>Informações Pessoais</Text>
                        </View>
                        <Ionicons name="chevron-forward-outline" size={20} color={COLORS.text} importantForAccessibility='no-hide-descendants' />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.optionRow} 
                        onPress={() => { /* navegar para email/senha */ }}
                        accessible
                        accessibilityRole="button"
                        accessibilityLabel="Email e Senha"
                        accessibilityHint="Toque para gerenciar seu email e senha"
                    >
                        <View style={styles.optionLeft} importantForAccessibility='no-hide-descendants'>
                            <Ionicons name="shield-checkmark-outline" size={26} color={COLORS.text}/>
                            <Text style={styles.optionText}>Email & Senha</Text>
                        </View>
                        <Ionicons name="chevron-forward-outline" size={20} color={COLORS.text} importantForAccessibility='no-hide-descendants' />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.optionRow} 
                        onPress={() => { /* navegar para notificações */ }}
                        accessible
                        accessibilityRole="button"
                        accessibilityLabel="Notificações"
                        accessibilityHint="Toque para gerenciar suas notificações"
                    >
                        <View style={styles.optionLeft} importantForAccessibility='no-hide-descendants'>
                            <Ionicons name="notifications-outline" size={26} color={COLORS.text}/>
                            <Text style={styles.optionText}>Notificações</Text>
                        </View>
                        <Ionicons name="chevron-forward-outline" size={20} color={COLORS.text} importantForAccessibility='no-hide-descendants' />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.optionRow} 
                        onPress={() => { /* navegar para ajuda */ }}
                        accessible
                        accessibilityRole="button"
                        accessibilityLabel="Ajuda"
                        accessibilityHint="Toque para obter ajuda"
                    >
                        <View style={styles.optionLeft} importantForAccessibility='no-hide-descendants'>
                            <Ionicons name="help-outline" size={26} color={COLORS.text}/>
                            <Text style={styles.optionText}>Ajuda</Text>
                        </View>
                        <Ionicons name="chevron-forward-outline" size={20} color={COLORS.text} importantForAccessibility='no-hide-descendants' />
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonsRow}>
                    <TouchableOpacity
                        style={styles.cadastroButton}
                        onPress={() => navigation.navigate('Cadastro de Imoveis')}
                        accessible
                        accessibilityRole="button"
                        accessibilityLabel="Cadastrar Imóvel"
                        accessibilityHint="Toque para ir para a tela de cadastro de imóveis"
                    >
                        <Text style={styles.cadastroButtonText}>Cadastrar Imóvel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={logout}
                        accessible
                        accessibilityRole="button"
                        accessibilityLabel="Sair"
                        accessibilityHint="Toque para sair da sua conta"
                    >
                        <Text style={styles.logoutButtonText}>Sair</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContainer: {
        paddingTop: 65,
        flexGrow: 1,
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: COLORS.text,
    },
    profileContent: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.secondary,
        marginBottom: 12,
    },
    profileTextName: {
        fontSize: 20,
        color: COLORS.text,
        marginBottom: 4,
    },
    profileText: {
        fontSize: 16,
        color: COLORS.textGray,
    },
    optionsContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: COLORS.textGray,
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: COLORS.white,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    optionText: {
        fontSize: 16,
        color: COLORS.text,
        marginLeft: 12,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 10,
    },
    cadastroButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 8,
    },
    cadastroButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        flex: 1,
        backgroundColor: COLORS.secondary,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: 8,
    },
    logoutButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
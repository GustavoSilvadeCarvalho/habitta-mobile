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
                <Text style={styles.title}>Meu Perfil</Text>

                <View style={styles.profileContent}>
                    <View style={styles.profileImage} />
                    <Text style={styles.profileTextName}>{user?.name}</Text>
                    <Text style={styles.profileText}>{user?.email}</Text>
                </View>

                <View style={styles.optionsContainer}>
                    <TouchableOpacity style={styles.optionRow} onPress={() => { /* navegar para editar info pessoais */ }}>
                        <View style={styles.optionLeft}>
                            <Ionicons name="person-outline" size={26} color={COLORS.text}/>
                            <Text style={styles.optionText}>Informações Pessoais</Text>
                        </View>
                        <Ionicons name="chevron-forward-outline" size={20} color={COLORS.text} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionRow} onPress={() => { /* navegar para email/senha */ }}>
                        <View style={styles.optionLeft}>
                            <Ionicons name="shield-checkmark-outline" size={26} color={COLORS.text}/>
                            <Text style={styles.optionText}>Email & Senha</Text>
                        </View>
                        <Ionicons name="chevron-forward-outline" size={20} color={COLORS.text} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionRow} onPress={() => { /* navegar para notificações */ }}>
                        <View style={styles.optionLeft}>
                            <Ionicons name="notifications-outline" size={26} color={COLORS.text}/>
                            <Text style={styles.optionText}>Notificações</Text>
                        </View>
                        <Ionicons name="chevron-forward-outline" size={20} color={COLORS.text} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionRow} onPress={() => { /* navegar para ajuda */ }}>
                        <View style={styles.optionLeft}>
                            <Ionicons name="help-outline" size={26} color={COLORS.text}/>
                            <Text style={styles.optionText}>Ajuda</Text>
                        </View>
                        <Ionicons name="chevron-forward-outline" size={20} color={COLORS.text} />
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonsRow}>
                    <TouchableOpacity
                        style={styles.cadastroButton}
                        onPress={() => navigation.navigate('Cadastro de Imoveis')}
                    >
                        <Text style={styles.cadastroButtonText}>Cadastrar Imóvel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={logout}
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
        color: COLORS.gray,
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
        borderColor: COLORS.gray,
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
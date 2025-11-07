import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors'; 
import ScreenBackground from '../../components/common/ScreenBackground';
import ModalImovelCadastro from '../../components/common/ModalImovelCadastro';
import { Ionicons } from '@expo/vector-icons';

interface ImovelData {
    titulo: string;
    endereco: string;
    tipo: string;
    quartos: string;
    banheiros: string;
    garagens: string;
    area: string;
    valor: string;
    descricao: string;
    informacoesAdicionais: string;
}

const INITIAL_IMOVEL_DATA: ImovelData = {
    titulo: '',
    endereco: '',
    tipo: '',
    quartos: '',
    banheiros: '',
    garagens: '',
    area: '',
    valor: '',
    descricao: '',
    informacoesAdicionais: ''
};

export default function ProfileScreen() {
    const [showCadastroForm, setShowCadastroForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imovelData, setImovelData] = useState<ImovelData>(INITIAL_IMOVEL_DATA);
    const { user, logout, setTransitioning } = useContext(AuthContext);
    const [erros, setErros] = useState<Partial<Record<keyof ImovelData, string>>>({});

    const validarFormulario = (): boolean => {
        let novosErros: Partial<Record<keyof ImovelData, string>> = {};
        let valido = true;

        if (!imovelData.titulo.trim()) {
            novosErros.titulo = 'O título é obrigatório.';
            valido = false;
        }
        if (!imovelData.endereco.trim()) {
            novosErros.endereco = 'O endereço é obrigatório.';
            valido = false;
        }
        if (!imovelData.tipo.trim()) {
            novosErros.tipo = 'O tipo é obrigatório.';
            valido = false;
        }

        const valorNumerico = Number(imovelData.valor.replace(',', '.'));
        if (imovelData.valor && isNaN(valorNumerico)) {
            novosErros.valor = 'Informe um valor válido.';
            valido = false;
        }

        setErros(novosErros);

        if (!valido) {
            Alert.alert('Erro no Formulário', 'Por favor, corrija os campos indicados.');
        }

        return valido;
    };

    const formatarDadosParaEnvio = () => {
        const parseNum = (str: string) => str ? parseInt(str) : 0;
        const parseFloatNum = (str: string) => str ? parseFloat(str.replace(',', '.')) : 0;
        
        return {
            ...imovelData,
            quartos: parseNum(imovelData.quartos),
            banheiros: parseNum(imovelData.banheiros),
            garagens: parseNum(imovelData.garagens),
            area: parseFloatNum(imovelData.area),
            valor: parseFloatNum(imovelData.valor),
        };
    };

    const enviarParaAPI = async (dados: any): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Dados enviados para API:', dados);
                resolve(true);
            }, 2000);
        });
    };

    const handleCadastrarImovel = async () => {
        if (!validarFormulario()) {
            return;
        }

        setLoading(true);

        try {
            const dadosFormatados = formatarDadosParaEnvio();
            
            const sucesso = await enviarParaAPI(dadosFormatados);

            if (sucesso) {
                Alert.alert(
                    'Sucesso!',
                    'Imóvel cadastrado com sucesso!',
                    [{
                        text: 'OK',
                        onPress: () => {
                            setImovelData(INITIAL_IMOVEL_DATA);
                            setErros({});
                            setShowCadastroForm(false);
                        }
                    }]
                );
            } else {
                throw new Error('Falha no cadastro (Resposta da API não foi sucesso)');
            }
        } catch (error) {
            console.error('Erro no cadastro:', error);
            Alert.alert('Erro', 'Não foi possível cadastrar o imóvel. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const updateImovelData = (field: keyof ImovelData, value: string) => {
        if (erros[field]) {
            setErros(prev => {
                const { [field]: _, ...rest } = prev;
                return rest;
            });
        }

        let cleanValue = value;
        if (['quartos', 'banheiros', 'garagens'].includes(field)) {
            cleanValue = value.replace(/[^0-9]/g, '');
        } else if (['area', 'valor'].includes(field)) {
            cleanValue = value.replace(/[^0-9,.]/g, ''); 
        }

        setImovelData(prev => ({
            ...prev,
            [field]: cleanValue
        }));
    };

    const handleCancelar = () => {
        setImovelData(INITIAL_IMOVEL_DATA);
        setErros({});
        setShowCadastroForm(false);
    };

    return (
        <ScreenBackground style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>Meu Perfil</Text>
                <View style={styles.profileContent}>
                        <View style={styles.profileImage}></View>
                        <Text style={styles.profileTextName}>{user?.name}</Text>
                        <Text style={styles.profileText}>{user?.email}</Text>
                        <View style={styles.editContent}>
                            <View style={styles.editContentLeft}>
                                <Ionicons name="person-outline" size={33} color={COLORS.text}/>
                                <Text style={styles.editText}>Informações Pessoais</Text>
                            </View>
                            <Ionicons name="chevron-forward-outline" size={20} color={COLORS.text} />
                        </View>
                        <View style={styles.editContent}>
                            <View style={styles.editContentLeft}>
                                <Ionicons name="shield-checkmark-outline" size={33} color={COLORS.text}/>
                                <Text style={styles.editText}>Email & Senha</Text>
                            </View>
                            <Ionicons name="chevron-forward-outline" size={20} color={COLORS.text} />
                        </View>
                        <View style={styles.editContent}>
                            <View style={styles.editContentLeft}>
                                <Ionicons name="notifications-outline" size={33} color={COLORS.text}/>
                                <Text style={styles.editText}>Notificações</Text>
                            </View>
                            <Ionicons name="chevron-forward-outline" size={20} color={COLORS.text} />
                        </View>
                        <View style={styles.editContent}>
                            <View style={styles.editContentLeft}>
                                <Ionicons name="help-outline" size={33} color={COLORS.text}/>
                                <Text style={styles.editText}>Ajuda</Text>
                            </View>
                            <Ionicons name="chevron-forward-outline" size={20} color={COLORS.text} />
                        </View>
                </View>
                {!showCadastroForm ? (
                    <View>
                        <TouchableOpacity 
                            style={styles.cadastroButton}
                            onPress={() => setShowCadastroForm(true)}
                            disabled={loading}
                        />
                        <Text style={styles.cadastroButtonText}>Cadastrar Imóvel</Text>
                    </View>
                ) : (
                    <ModalImovelCadastro
                        visible={showCadastroForm}
                        loading={loading}
                        imovelData={imovelData}
                        erros={erros}
                        onChange={updateImovelData}
                        onSubmit={handleCadastrarImovel}
                        onCancel={handleCancelar}
                    />
                )}
            </ScrollView>
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: COLORS.primary,
    },
    profileContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.secondary,
    },
    profileText: {
        fontSize: 16,
        textAlign: 'left',
        color: COLORS.text,
    },
    profileTextName: {
        fontSize: 20,
        textAlign: 'left',
        color: COLORS.text,
    },
    editContent: {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 5,
        borderWidth: 1,
        borderColor: COLORS.gray,
        padding: 10,
        paddingVertical: 15,
        width: '90%',
        borderRadius: 13,
    },
    editContentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    editText: {
        fontSize: 16,
        color: COLORS.text,
    },
    cadastroButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cadastroButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
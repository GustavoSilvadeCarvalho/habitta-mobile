import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/colors';
import ScreenBackground from '../../components/common/ScreenBackground';

// Definindo a interface para os dados do imóvel
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

export default function ProfileScreen() {
    const [showCadastroForm, setShowCadastroForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imovelData, setImovelData] = useState<ImovelData>({
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
    });

    // Função para validar os dados do formulário
    const validarFormulario = (): boolean => {
        if (!imovelData.titulo.trim()) {
            Alert.alert('Erro', 'Por favor, informe o título do imóvel');
            return false;
        }
        if (!imovelData.endereco.trim()) {
            Alert.alert('Erro', 'Por favor, informe o endereço do imóvel');
            return false;
        }
        if (!imovelData.tipo.trim()) {
            Alert.alert('Erro', 'Por favor, informe o tipo do imóvel');
            return false;
        }
        if (imovelData.valor && isNaN(Number(imovelData.valor.replace(',', '.')))) {
            Alert.alert('Erro', 'Por favor, informe um valor válido');
            return false;
        }
        return true;
    };

    // Função para formatar os dados antes do envio
    const formatarDadosParaEnvio = () => {
        return {
            ...imovelData,
            quartos: imovelData.quartos ? parseInt(imovelData.quartos) : 0,
            banheiros: imovelData.banheiros ? parseInt(imovelData.banheiros) : 0,
            garagens: imovelData.garagens ? parseInt(imovelData.garagens) : 0,
            area: imovelData.area ? parseFloat(imovelData.area) : 0,
            valor: imovelData.valor ? parseFloat(imovelData.valor.replace(',', '.')) : 0,
        };
    };

    // Função para simular o envio para API (substitua pela sua API real)
    const enviarParaAPI = async (dados: any): Promise<boolean> => {
        // Simulando uma chamada de API
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Dados enviados para API:', dados);
                // Simulando sucesso (na prática, verifique a resposta da API)
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
            
            // Substitua esta função pela sua chamada real de API
            const sucesso = await enviarParaAPI(dadosFormatados);

            if (sucesso) {
                Alert.alert(
                    'Sucesso!',
                    'Imóvel cadastrado com sucesso!',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                setShowCadastroForm(false);
                                // Limpar os dados do formulário
                                setImovelData({
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
                                });
                            }
                        }
                    ]
                );
            } else {
                throw new Error('Erro ao cadastrar imóvel');
            }
        } catch (error) {
            console.error('Erro no cadastro:', error);
            Alert.alert('Erro', 'Não foi possível cadastrar o imóvel. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const updateImovelData = (field: keyof ImovelData, value: string) => {
        setImovelData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Função para limpar formulário
    const handleCancelar = () => {
        setImovelData({
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
        });
        setShowCadastroForm(false);
    };

    return (
        <ScreenBackground style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Meu Perfil</Text>
                
                {!showCadastroForm ? (
                    <View style={styles.profileContent}>
                        <Text style={styles.welcomeText}>Bem-vindo ao seu perfil!</Text>
                        
                        <TouchableOpacity 
                            style={styles.cadastroButton}
                            onPress={() => setShowCadastroForm(true)}
                            disabled={loading}
                        >
                            <Text style={styles.cadastroButtonText}>Cadastrar Imóvel</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.cadastroForm}>
                        <Text style={styles.formTitle}>Cadastrar Novo Imóvel</Text>
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Título do imóvel *"
                            value={imovelData.titulo}
                            onChangeText={(text) => updateImovelData('titulo', text)}
                            editable={!loading}
                        />
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Endereço completo *"
                            value={imovelData.endereco}
                            onChangeText={(text) => updateImovelData('endereco', text)}
                            editable={!loading}
                        />
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Tipo (Casa, Apartamento, etc.) *"
                            value={imovelData.tipo}
                            onChangeText={(text) => updateImovelData('tipo', text)}
                            editable={!loading}
                        />
                        
                        <View style={styles.rowInputs}>
                            <TextInput
                                style={[styles.input, styles.halfInput]}
                                placeholder="Quartos"
                                keyboardType="number-pad"
                                value={imovelData.quartos}
                                onChangeText={(text) => updateImovelData('quartos', text.replace(/[^0-9]/g, ''))}
                                editable={!loading}
                            />
                            
                            <TextInput
                                style={[styles.input, styles.halfInput]}
                                placeholder="Banheiros"
                                keyboardType="number-pad"
                                value={imovelData.banheiros}
                                onChangeText={(text) => updateImovelData('banheiros', text.replace(/[^0-9]/g, ''))}
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.rowInputs}>
                            <TextInput
                                style={[styles.input, styles.halfInput]}
                                placeholder="Garagens"
                                keyboardType="number-pad"
                                value={imovelData.garagens}
                                onChangeText={(text) => updateImovelData('garagens', text.replace(/[^0-9]/g, ''))}
                                editable={!loading}
                            />
                            
                            <TextInput
                                style={[styles.input, styles.halfInput]}
                                placeholder="Área (m²)"
                                keyboardType="decimal-pad"
                                value={imovelData.area}
                                onChangeText={(text) => updateImovelData('area', text.replace(/[^0-9,.]/g, ''))}
                                editable={!loading}
                            />
                        </View>
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Valor (R$)"
                            keyboardType="decimal-pad"
                            value={imovelData.valor}
                            onChangeText={(text) => updateImovelData('valor', text.replace(/[^0-9,.]/g, ''))}
                            editable={!loading}
                        />
                        
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Descrição do imóvel"
                            multiline
                            numberOfLines={4}
                            value={imovelData.descricao}
                            onChangeText={(text) => updateImovelData('descricao', text)}
                            editable={!loading}
                        />

                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Informações adicionais (mobília, condomínio, IPTU, etc.)"
                            multiline
                            numberOfLines={4}
                            value={imovelData.informacoesAdicionais}
                            onChangeText={(text) => updateImovelData('informacoesAdicionais', text)}
                            editable={!loading}
                        />
                        
                        <View style={styles.formButtons}>
                            <TouchableOpacity 
                                style={[styles.button, styles.cancelButton, loading && styles.buttonDisabled]}
                                onPress={handleCancelar}
                                disabled={loading}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
                                onPress={handleCadastrarImovel}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text style={styles.submitButtonText}>Salvar Imóvel</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.obrigatorioText}>* Campos obrigatórios</Text>
                    </View>
                )}
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
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    welcomeText: {
        fontSize: 16,
        marginBottom: 30,
        textAlign: 'center',
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
    cadastroForm: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: COLORS.primary,
    },
    input: {
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: 'white',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        flex: 0.48,
    },
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 0.48,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    cancelButton: {
        backgroundColor: '#F0F0F0',
    },
    submitButton: {
        backgroundColor: COLORS.primary,
    },
    cancelButtonText: {
        color: COLORS.text,
        fontWeight: 'bold',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    obrigatorioText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
    },
});
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView, ActivityIndicator } from 'react-native';
// Assumindo que COLORS e ScreenBackground estão disponíveis
import { COLORS } from '../../constants/colors'; 
import ScreenBackground from '../../components/common/ScreenBackground'; 
import { Ionicons } from '@expo/vector-icons';

// --- Configuração ---
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

// Componente simples para exibir erros
const ErrorText = ({ message }: { message?: string }) => 
  message ? <Text style={styles.errorText}>{message}</Text> : null;

export default function ProfileScreen() {
    const [showCadastroForm, setShowCadastroForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imovelData, setImovelData] = useState<ImovelData>(INITIAL_IMOVEL_DATA);
    const { user, logout, setTransitioning } = useContext(AuthContext);
    const [erros, setErros] = useState<Partial<Record<keyof ImovelData, string>>>({}); // Novo estado para erros

    // Função para validar os dados do formulário
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
        
        // Validação de valor numérico
        const valorNumerico = Number(imovelData.valor.replace(',', '.'));
        if (imovelData.valor && isNaN(valorNumerico)) {
            novosErros.valor = 'Informe um valor válido.';
            valido = false;
        }

        setErros(novosErros);

        if (!valido) {
            // Mantenha o Alert para feedback geral, mas os erros mais finos estão sob os campos
            Alert.alert('Erro no Formulário', 'Por favor, corrija os campos indicados.');
        }

        return valido;
    };

    // Função para formatar os dados antes do envio (sem alteração significativa, está boa)
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

    // Função para simular o envio para API
    const enviarParaAPI = async (dados: any): Promise<boolean> => {
        // SIMULAÇÃO: Substitua pela sua chamada real de API (ex: axios.post('/imoveis', dados))
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Dados enviados para API:', dados);
                resolve(true); // Sucesso simulado
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
                            setImovelData(INITIAL_IMOVEL_DATA); // Limpa
                            setErros({}); // Limpa erros
                            setShowCadastroForm(false);
                        }
                    }]
                );
            } else {
                // Se a API retornar false mas não lançar erro (caso raro)
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
        // Limpar o erro ao digitar
        if (erros[field]) {
            setErros(prev => {
                const { [field]: _, ...rest } = prev;
                return rest;
            });
        }
        
        // Regras de limpeza de input
        let cleanValue = value;
        if (['quartos', 'banheiros', 'garagens'].includes(field)) {
            cleanValue = value.replace(/[^0-9]/g, '');
        } else if (['area', 'valor'].includes(field)) {
             // Permite números, vírgula e ponto
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
                            disabled={loading} // Mantenha disabled para prevenir clique duplo
                        >     
                        </TouchableOpacity>
                        <Text style={styles.cadastroButtonText}>Cadastrar Imóvel</Text>
                    </View>
                    
                ) : (
                    <View style={styles.cadastroForm}>
                        <Text style={styles.formTitle}>Cadastrar Novo Imóvel</Text>
                        
                        {/* TÍTULO */}
                        <TextInput
                            style={[styles.input, erros.titulo && styles.inputError]}
                            placeholder="Título do imóvel *"
                            value={imovelData.titulo}
                            onChangeText={(text) => updateImovelData('titulo', text)}
                            editable={!loading}
                            returnKeyType="next"
                        />
                        <ErrorText message={erros.titulo} />
                        
                        {/* ENDEREÇO */}
                        <TextInput
                            style={[styles.input, erros.endereco && styles.inputError]}
                            placeholder="Endereço completo *"
                            value={imovelData.endereco}
                            onChangeText={(text) => updateImovelData('endereco', text)}
                            editable={!loading}
                            returnKeyType="next"
                        />
                        <ErrorText message={erros.endereco} />
                        
                        {/* TIPO */}
                        <TextInput
                            style={[styles.input, erros.tipo && styles.inputError]}
                            placeholder="Tipo (Casa, Apartamento, etc.) *"
                            value={imovelData.tipo}
                            onChangeText={(text) => updateImovelData('tipo', text)}
                            editable={!loading}
                            returnKeyType="next"
                        />
                        <ErrorText message={erros.tipo} />
                        
                        {/* QUARTOS E BANHEIROS */}
                        <View style={styles.rowInputs}>
                            <TextInput
                                style={[styles.input, styles.halfInput, erros.quartos && styles.inputError]}
                                placeholder="Quartos"
                                keyboardType="number-pad"
                                value={imovelData.quartos}
                                onChangeText={(text) => updateImovelData('quartos', text)}
                                editable={!loading}
                                returnKeyType="next"
                            />
                            <TextInput
                                style={[styles.input, styles.halfInput, erros.banheiros && styles.inputError]}
                                placeholder="Banheiros"
                                keyboardType="number-pad"
                                value={imovelData.banheiros}
                                onChangeText={(text) => updateImovelData('banheiros', text)}
                                editable={!loading}
                                returnKeyType="next"
                            />
                        </View>
                        <View style={styles.rowInputs}> 
                            <View style={styles.halfInputContainer}><ErrorText message={erros.quartos} /></View>
                            <View style={styles.halfInputContainer}><ErrorText message={erros.banheiros} /></View>
                        </View>

                        {/* GARAGENS E ÁREA */}
                        <View style={styles.rowInputs}>
                            <TextInput
                                style={[styles.input, styles.halfInput, erros.garagens && styles.inputError]}
                                placeholder="Garagens"
                                keyboardType="number-pad"
                                value={imovelData.garagens}
                                onChangeText={(text) => updateImovelData('garagens', text)}
                                editable={!loading}
                                returnKeyType="next"
                            />
                            <TextInput
                                style={[styles.input, styles.halfInput, erros.area && styles.inputError]}
                                placeholder="Área (m²)"
                                keyboardType="decimal-pad"
                                value={imovelData.area}
                                onChangeText={(text) => updateImovelData('area', text)}
                                editable={!loading}
                                returnKeyType="next"
                            />
                        </View>
                        <View style={styles.rowInputs}> 
                            <View style={styles.halfInputContainer}><ErrorText message={erros.garagens} /></View>
                            <View style={styles.halfInputContainer}><ErrorText message={erros.area} /></View>
                        </View>
                        
                        {/* VALOR */}
                        <TextInput
                            style={[styles.input, erros.valor && styles.inputError]}
                            placeholder="Valor (R$)"
                            keyboardType="decimal-pad"
                            value={imovelData.valor}
                            onChangeText={(text) => updateImovelData('valor', text)}
                            editable={!loading}
                            returnKeyType="next"
                        />
                        <ErrorText message={erros.valor} />
                        
                        {/* DESCRIÇÃO */}
                        <TextInput
                            style={[styles.input, styles.textArea, erros.descricao && styles.inputError]}
                            placeholder="Descrição do imóvel"
                            multiline
                            numberOfLines={4}
                            value={imovelData.descricao}
                            onChangeText={(text) => updateImovelData('descricao', text)}
                            editable={!loading}
                            returnKeyType="default"
                        />
                        <ErrorText message={erros.descricao} />

                        {/* INFORMAÇÕES ADICIONAIS */}
                        <TextInput
                            style={[styles.input, styles.textArea, erros.informacoesAdicionais && styles.inputError]}
                            placeholder="Informações adicionais (mobília, condomínio, IPTU, etc.)"
                            multiline
                            numberOfLines={4}
                            value={imovelData.informacoesAdicionais}
                            onChangeText={(text) => updateImovelData('informacoesAdicionais', text)}
                            editable={!loading}
                            returnKeyType="done"
                        />
                        <ErrorText message={erros.informacoesAdicionais} />
                        
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
    // ... estilos existentes
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
        border: `1px solid ${COLORS.gray}`,
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
        marginBottom: 15, // Aumentei para dar espaço ao ErrorText
        fontSize: 16,
        backgroundColor: 'white',
    },
    inputError: { // Novo estilo para inputs com erro
        borderColor: 'red',
        borderWidth: 2,
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
        marginBottom: 5, // Reduzi para usar o espaço do ErrorText
    },
    halfInputContainer: { // Novo para envolver o ErrorText nos inputs de linha
        flex: 0.48,
        marginBottom: 15, // Margem abaixo para consistência
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
    // NOVO ESTILO PARA ERRO
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -10, 
        marginBottom: 10,
        marginLeft: 5, // Pequena margem para a esquerda
    },
});
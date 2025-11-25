import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Modal, TextInput, Dimensions } from 'react-native';
import { COLORS } from '../../constants/colors'; 
import ScreenBackground from '../../components/common/ScreenBackground';
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

// Componente Modal responsivo
const ModalImovelCadastro = ({ 
    visible, 
    loading, 
    imovelData, 
    erros, 
    onChange, 
    onSubmit, 
    onCancel 
}: any) => {
    const { width } = Dimensions.get('window');
    const isMobile = width < 768;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
        >
            <ScreenBackground style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Cadastrar Imóvel</Text>
                    <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView 
                    style={styles.modalContent}
                    contentContainerStyle={styles.modalScrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Campo Título */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Título *</Text>
                        <TextInput
                            style={[styles.input, erros.titulo && styles.inputError]}
                            placeholder="Digite o título do imóvel"
                            value={imovelData.titulo}
                            onChangeText={(value) => onChange('titulo', value)}
                        />
                        {erros.titulo && <Text style={styles.errorText}>{erros.titulo}</Text>}
                    </View>

                    {/* Campo Endereço */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Endereço *</Text>
                        <TextInput
                            style={[styles.input, erros.endereco && styles.inputError]}
                            placeholder="Digite o endereço completo"
                            value={imovelData.endereco}
                            onChangeText={(value) => onChange('endereco', value)}
                        />
                        {erros.endereco && <Text style={styles.errorText}>{erros.endereco}</Text>}
                    </View>

                    {/* Campo Tipo */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tipo *</Text>
                        <TextInput
                            style={[styles.input, erros.tipo && styles.inputError]}
                            placeholder="Ex: Casa, Apartamento, etc."
                            value={imovelData.tipo}
                            onChangeText={(value) => onChange('tipo', value)}
                        />
                        {erros.tipo && <Text style={styles.errorText}>{erros.tipo}</Text>}
                    </View>

                    {/* Campos numéricos em linha para mobile */}
                    <View style={isMobile ? styles.mobileRow : styles.desktopRow}>
                        <View style={isMobile ? styles.mobileInputGroup : styles.desktopInputGroup}>
                            <Text style={styles.label}>Quartos</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                keyboardType="numeric"
                                value={imovelData.quartos}
                                onChangeText={(value) => onChange('quartos', value)}
                            />
                        </View>

                        <View style={isMobile ? styles.mobileInputGroup : styles.desktopInputGroup}>
                            <Text style={styles.label}>Banheiros</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                keyboardType="numeric"
                                value={imovelData.banheiros}
                                onChangeText={(value) => onChange('banheiros', value)}
                            />
                        </View>

                        <View style={isMobile ? styles.mobileInputGroup : styles.desktopInputGroup}>
                            <Text style={styles.label}>Vagas</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                keyboardType="numeric"
                                value={imovelData.garagens}
                                onChangeText={(value) => onChange('garagens', value)}
                            />
                        </View>
                    </View>

                    {/* Área e Valor */}
                    <View style={isMobile ? styles.column : styles.row}>
                        <View style={isMobile ? styles.fullWidth : styles.halfWidth}>
                            <Text style={styles.label}>Área (m²)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                keyboardType="decimal-pad"
                                value={imovelData.area}
                                onChangeText={(value) => onChange('area', value)}
                            />
                        </View>

                        <View style={isMobile ? styles.fullWidth : styles.halfWidth}>
                            <Text style={styles.label}>Valor (R$)</Text>
                            <TextInput
                                style={[styles.input, erros.valor && styles.inputError]}
                                placeholder="0,00"
                                keyboardType="decimal-pad"
                                value={imovelData.valor}
                                onChangeText={(value) => onChange('valor', value)}
                            />
                            {erros.valor && <Text style={styles.errorText}>{erros.valor}</Text>}
                        </View>
                    </View>

                    {/* Descrição */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Descrição</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Descreva o imóvel..."
                            multiline
                            numberOfLines={4}
                            value={imovelData.descricao}
                            onChangeText={(value) => onChange('descricao', value)}
                        />
                    </View>

                    {/* Informações Adicionais */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Informações Adicionais</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Informações extras..."
                            multiline
                            numberOfLines={3}
                            value={imovelData.informacoesAdicionais}
                            onChangeText={(value) => onChange('informacoesAdicionais', value)}
                        />
                    </View>

                    {/* Botões */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={[styles.button, styles.cancelButton]} 
                            onPress={onCancel}
                            disabled={loading}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]} 
                            onPress={onSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <Text style={styles.submitButtonText}>Cadastrando...</Text>
                            ) : (
                                <Text style={styles.submitButtonText}>Cadastrar Imóvel</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ScreenBackground>
        </Modal>
    );
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
                
                <TouchableOpacity 
                    style={styles.cadastroButton}
                    onPress={() => setShowCadastroForm(true)}
                    disabled={loading}
                >
                    <Text style={styles.cadastroButtonText}>Cadastrar Imóvel</Text>
                </TouchableOpacity>

                <ModalImovelCadastro
                    visible={showCadastroForm}
                    loading={loading}
                    imovelData={imovelData}
                    erros={erros}
                    onChange={updateImovelData}
                    onSubmit={handleCadastrarImovel}
                    onCancel={handleCancelar}
                />
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
        borderWidth: 1,
        borderColor: COLORS.gray,
        padding: 15,
        width: '100%',
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
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 80,
    },
    cadastroButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    // Estilos do Modal
    modalContainer: {
        flex: 1,
        paddingTop: 50,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    closeButton: {
        padding: 5,
    },
    modalContent: {
        flex: 1,
    },
    modalScrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 6,
    },
    input: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: COLORS.text,
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    // Layout responsivo
    mobileRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    desktopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    mobileInputGroup: {
        flex: 1,
        marginHorizontal: 4,
    },
    desktopInputGroup: {
        flex: 1,
        marginHorizontal: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    column: {
        marginBottom: 16,
    },
    halfWidth: {
        flex: 1,
        marginHorizontal: 8,
    },
    fullWidth: {
        width: '100%',
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: COLORS.gray,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    cancelButtonText: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '600',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
});
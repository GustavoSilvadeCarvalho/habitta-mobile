import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView, Alert } from 'react-native';
import { COLORS } from '../../constants/colors';

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

interface ModalImovelCadastroProps {
    visible: boolean;
    loading: boolean;
    imovelData: ImovelData;
    erros: Partial<Record<keyof ImovelData, string>>;
    onChange: (field: keyof ImovelData, value: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
}

const ErrorText = ({ message }: { message?: string }) => 
  message ? <Text style={styles.errorText}>{message}</Text> : null;

const ModalImovelCadastro: React.FC<ModalImovelCadastroProps> = ({
    visible,
    loading,
    imovelData,
    erros,
    onChange,
    onSubmit,
    onCancel
}) => {
    if (!visible) return null;
    return (
        <View style={styles.overlay}>
            <View style={styles.cadastroForm}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <Text style={styles.formTitle}>Cadastrar Novo Imóvel</Text>
                    {/* TÍTULO */}
                    <TextInput
                        style={[styles.input, erros.titulo && styles.inputError]}
                        placeholder="Título do imóvel *"
                        value={imovelData.titulo}
                        onChangeText={text => onChange('titulo', text)}
                        editable={!loading}
                        returnKeyType="next"
                    />
                    <ErrorText message={erros.titulo} />
                    {/* ENDEREÇO */}
                    <TextInput
                        style={[styles.input, erros.endereco && styles.inputError]}
                        placeholder="Endereço completo *"
                        value={imovelData.endereco}
                        onChangeText={text => onChange('endereco', text)}
                        editable={!loading}
                        returnKeyType="next"
                    />
                    <ErrorText message={erros.endereco} />
                    {/* TIPO */}
                    <TextInput
                        style={[styles.input, erros.tipo && styles.inputError]}
                        placeholder="Tipo (Casa, Apartamento, etc.) *"
                        value={imovelData.tipo}
                        onChangeText={text => onChange('tipo', text)}
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
                            onChangeText={text => onChange('quartos', text)}
                            editable={!loading}
                            returnKeyType="next"
                        />
                        <TextInput
                            style={[styles.input, styles.halfInput, erros.banheiros && styles.inputError]}
                            placeholder="Banheiros"
                            keyboardType="number-pad"
                            value={imovelData.banheiros}
                            onChangeText={text => onChange('banheiros', text)}
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
                            onChangeText={text => onChange('garagens', text)}
                            editable={!loading}
                            returnKeyType="next"
                        />
                        <TextInput
                            style={[styles.input, styles.halfInput, erros.area && styles.inputError]}
                            placeholder="Área (m²)"
                            keyboardType="decimal-pad"
                            value={imovelData.area}
                            onChangeText={text => onChange('area', text)}
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
                        onChangeText={text => onChange('valor', text)}
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
                        onChangeText={text => onChange('descricao', text)}
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
                        onChangeText={text => onChange('informacoesAdicionais', text)}
                        editable={!loading}
                        returnKeyType="done"
                    />
                    <ErrorText message={erros.informacoesAdicionais} />
                    <View style={styles.formButtons}>
                        <TouchableOpacity 
                            style={[styles.button, styles.cancelButton, loading && styles.buttonDisabled]}
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
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={styles.submitButtonText}>Salvar Imóvel</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.obrigatorioText}>* Campos obrigatórios</Text>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
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
        minWidth: '90%',
        maxWidth: 400,
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
    inputError: {
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
        marginBottom: 5,
    },
    halfInputContainer: {
        flex: 0.48,
        marginBottom: 15,
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
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -10, 
        marginBottom: 10,
        marginLeft: 5,
    },
});

export default ModalImovelCadastro;

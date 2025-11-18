
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView, Alert, Image, Platform } from 'react-native';
import ScreenBackground from '../../components/common/ScreenBackground';
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

export default function RegisterpropertyScreen({ navigation }: any) {
    const [imovelData, setImovelData] = useState<ImovelData>(INITIAL_IMOVEL_DATA);
    const [erros, setErros] = useState<Partial<Record<keyof ImovelData, string>>>({});
    const [loading, setLoading] = useState(false);

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

    // transaction type: 'rent' | 'sale'
    const [transactionType, setTransactionType] = useState<'rent' | 'sale' | ''>('');

    const [photos, setPhotos] = useState<string[]>([]);

    const askCameraPermissions = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            return status === 'granted';
        }
        return false;
    };

    const takePhoto = async () => {
        try {
            const ok = await askCameraPermissions();
            if (!ok) {
                Alert.alert('Permissão necessária', 'Permissão para usar a câmera é necessária.');
                return;
            }

            if (photos.length >= 8) {
                Alert.alert('Limite atingido', 'Você pode enviar no máximo 8 fotos.');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: false,
                quality: 0.7,
            });

            if (!result.cancelled) {
                // @ts-ignore
                const uri = result.uri || result.assets?.[0]?.uri;
                if (uri) setPhotos(prev => [...prev, uri]);
            }
        } catch (err) {
            console.error('Erro ao abrir câmera', err);
            Alert.alert('Erro', 'Não foi possível abrir a câmera.');
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const enviarParaAPI = async (dados: any): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Dados enviados para API:', dados);
                resolve(true);
            }, 1500);
        });
    };

    const handleSubmit = async () => {
        // attach transaction type and photos
        if (!transactionType) {
            Alert.alert('Selecione o tipo', 'Escolha se o anúncio é para aluguel ou venda.');
            return;
        }
        if (!validarFormulario()) return;
        setLoading(true);
        try {
            const dados = formatarDadosParaEnvio();
            const payload = { ...dados, transactionType, photos };
            const ok = await enviarParaAPI(payload);
            if (ok) {
                Alert.alert('Sucesso', 'Imóvel cadastrado com sucesso!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
                setImovelData(INITIAL_IMOVEL_DATA);
                setErros({});
                setTransactionType('');
                setPhotos([]);
            } else {
                throw new Error('Erro no envio');
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Erro', 'Não foi possível cadastrar o imóvel.');
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

        setImovelData(prev => ({ ...prev, [field]: cleanValue }));
    };

    const handleCancel = () => {
        setImovelData(INITIAL_IMOVEL_DATA);
        setErros({});
        navigation.goBack();
    };

    return (
        <ScreenBackground style={styles.container}>
            <ScrollView keyboardShouldPersistTaps="handled">
                <Text style={styles.formTitle}>Cadastrar Novo Imóvel</Text>
                <TextInput
                    style={[styles.input, erros.titulo && styles.inputError]}
                    placeholder="Título do imóvel *"
                    value={imovelData.titulo}
                    onChangeText={text => updateImovelData('titulo', text)}
                    editable={!loading}
                    returnKeyType="next"
                />
                {erros.titulo ? <Text style={styles.errorText}>{erros.titulo}</Text> : null}

                <TextInput
                    style={[styles.input, erros.endereco && styles.inputError]}
                    placeholder="Endereço completo *"
                    value={imovelData.endereco}
                    onChangeText={text => updateImovelData('endereco', text)}
                    editable={!loading}
                    returnKeyType="next"
                />
                {erros.endereco ? <Text style={styles.errorText}>{erros.endereco}</Text> : null}

                <TextInput
                    style={[styles.input, erros.tipo && styles.inputError]}
                    placeholder="Tipo (Casa, Apartamento, etc.) *"
                    value={imovelData.tipo}
                    onChangeText={text => updateImovelData('tipo', text)}
                    editable={!loading}
                    returnKeyType="next"
                />
                {erros.tipo ? <Text style={styles.errorText}>{erros.tipo}</Text> : null}

                <View style={styles.typeSelectorRow}>
                    <Text style={styles.typeLabel}>Tipo de anúncio:</Text>
                    <View style={styles.typeButtons}>
                        <TouchableOpacity
                            style={[styles.typeBtn, transactionType === 'rent' && styles.typeBtnSelected]}
                            onPress={() => setTransactionType('rent')}
                        >
                            <Text style={[styles.typeBtnText, transactionType === 'rent' && styles.typeBtnTextSelected]}>Alugar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeBtn, transactionType === 'sale' && styles.typeBtnSelected]}
                            onPress={() => setTransactionType('sale')}
                        >
                            <Text style={[styles.typeBtnText, transactionType === 'sale' && styles.typeBtnTextSelected]}>Vender</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.rowInputs}>
                    <TextInput
                        style={[styles.input, styles.halfInput, erros.quartos && styles.inputError]}
                        placeholder="Quartos"
                        keyboardType="number-pad"
                        value={imovelData.quartos}
                        onChangeText={text => updateImovelData('quartos', text)}
                        editable={!loading}
                        returnKeyType="next"
                    />
                    <TextInput
                        style={[styles.input, styles.halfInput, erros.banheiros && styles.inputError]}
                        placeholder="Banheiros"
                        keyboardType="number-pad"
                        value={imovelData.banheiros}
                        onChangeText={text => updateImovelData('banheiros', text)}
                        editable={!loading}
                        returnKeyType="next"
                    />
                </View>
                <View style={styles.rowInputs}>
                    <View style={styles.halfInputContainer}>{erros.quartos ? <Text style={styles.errorText}>{erros.quartos}</Text> : null}</View>
                    <View style={styles.halfInputContainer}>{erros.banheiros ? <Text style={styles.errorText}>{erros.banheiros}</Text> : null}</View>
                </View>

                <View style={styles.rowInputs}>
                    <TextInput
                        style={[styles.input, styles.halfInput, erros.garagens && styles.inputError]}
                        placeholder="Garagens"
                        keyboardType="number-pad"
                        value={imovelData.garagens}
                        onChangeText={text => updateImovelData('garagens', text)}
                        editable={!loading}
                        returnKeyType="next"
                    />
                    <TextInput
                        style={[styles.input, styles.halfInput, erros.area && styles.inputError]}
                        placeholder="Área (m²)"
                        keyboardType="decimal-pad"
                        value={imovelData.area}
                        onChangeText={text => updateImovelData('area', text)}
                        editable={!loading}
                        returnKeyType="next"
                    />
                </View>
                <View style={styles.rowInputs}>
                    <View style={styles.halfInputContainer}>{erros.garagens ? <Text style={styles.errorText}>{erros.garagens}</Text> : null}</View>
                    <View style={styles.halfInputContainer}>{erros.area ? <Text style={styles.errorText}>{erros.area}</Text> : null}</View>
                </View>

                <TextInput
                    style={[styles.input, erros.valor && styles.inputError]}
                    placeholder="Valor (R$)"
                    keyboardType="decimal-pad"
                    value={imovelData.valor}
                    onChangeText={text => updateImovelData('valor', text)}
                    editable={!loading}
                    returnKeyType="next"
                />
                {erros.valor ? <Text style={styles.errorText}>{erros.valor}</Text> : null}

                <TextInput
                    style={[styles.input, styles.textArea, erros.descricao && styles.inputError]}
                    placeholder="Descrição do imóvel"
                    multiline
                    numberOfLines={4}
                    value={imovelData.descricao}
                    onChangeText={text => updateImovelData('descricao', text)}
                    editable={!loading}
                    returnKeyType="default"
                />
                {erros.descricao ? <Text style={styles.errorText}>{erros.descricao}</Text> : null}

                <TextInput
                    style={[styles.input, styles.textArea, erros.informacoesAdicionais && styles.inputError]}
                    placeholder="Informações adicionais (mobília, condomínio, IPTU, etc.)"
                    multiline
                    numberOfLines={4}
                    value={imovelData.informacoesAdicionais}
                    onChangeText={text => updateImovelData('informacoesAdicionais', text)}
                    editable={!loading}
                    returnKeyType="done"
                />
                {erros.informacoesAdicionais ? <Text style={styles.errorText}>{erros.informacoesAdicionais}</Text> : null}

                <View style={styles.photosSection}>
                    <Text style={styles.photosTitle}>Fotos (máx. 8)</Text>
                    <View style={styles.photosRow}>
                        {photos.map((uri, i) => (
                            <View key={i} style={styles.photoWrapper}>
                                <Image source={{ uri }} style={styles.photoThumb} />
                                <TouchableOpacity style={styles.removePhotoBtn} onPress={() => removePhoto(i)}>
                                    <Text style={styles.removePhotoText}>X</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        {photos.length < 8 && (
                            <TouchableOpacity style={styles.takePhotoBtn} onPress={takePhoto}>
                                <Text style={styles.takePhotoText}>Tirar Foto</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={styles.formButtons}>
                    <TouchableOpacity 
                        style={[styles.button, styles.cancelButton, loading && styles.buttonDisabled]}
                        onPress={handleCancel}
                        disabled={loading}
                    >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
                        onPress={handleSubmit}
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
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 16,
        backgroundColor: COLORS.background,
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
    typeSelectorRow: {
        marginBottom: 15,
    },
    typeLabel: {
        fontSize: 14,
        marginBottom: 8,
        color: COLORS.text,
    },
    typeButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 8,
    },
    typeBtn: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DDD',
        backgroundColor: 'white',
    },
    typeBtnSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    typeBtnText: {
        color: COLORS.text,
        fontWeight: '600',
    },
    typeBtnTextSelected: {
        color: 'white',
    },
    photosSection: {
        marginTop: 10,
        marginBottom: 8,
    },
    photosTitle: {
        fontSize: 14,
        marginBottom: 8,
        color: COLORS.text,
    },
    photosRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        alignItems: 'flex-start',
    },
    photoWrapper: {
        width: 90,
        height: 90,
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 8,
        marginBottom: 8,
    },
    photoThumb: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removePhotoBtn: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removePhotoText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '700',
    },
    takePhotoBtn: {
        width: 90,
        height: 90,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DDD',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
    },
    takePhotoText: {
        fontSize: 12,
        color: COLORS.text,
        textAlign: 'center',
    },
});

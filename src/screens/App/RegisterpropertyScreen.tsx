import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView, Alert, Image, Platform } from 'react-native';
import ScreenBackground from '../../components/common/ScreenBackground';
import { COLORS } from '../../constants/colors';
import { storage, firestore } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../../contexts/AuthContext';

interface ImovelData {
    title: string;
    address: string;
    type: string;
    bedrooms: string;
    bathrooms: string;
    garages: string;
    area: string;
    price: string;
    description: string;
    additionalInformation: string;
}

const INITIAL_IMOVEL_DATA: ImovelData = {
    title: '',
    address: '',
    type: '',
    bedrooms: '',
    bathrooms: '',
    garages: '',
    area: '',
    price: '',
    description: '',
    additionalInformation: ''
};

export default function RegisterpropertyScreen({ navigation }: any) {
    const [imovelData, setImovelData] = useState<ImovelData>(INITIAL_IMOVEL_DATA);
    const [erros, setErros] = useState<Partial<Record<keyof ImovelData, string>>>({});
    const [loading, setLoading] = useState(false);

    const { user } = useContext(AuthContext);

    const validarFormulario = (): boolean => {
        let novosErros: Partial<Record<keyof ImovelData, string>> = {};
        let valido = true;

        if (!imovelData.title.trim()) {
            novosErros.title = 'O título é obrigatório.';
            valido = false;
        }
        if (!imovelData.address.trim()) {
            novosErros.address = 'O endereço é obrigatório.';
            valido = false;
        }
        if (!imovelData.type.trim()) {
            novosErros.type = 'O tipo é obrigatório.';
            valido = false;
        }

        const valorNumerico = Number(imovelData.price.replace(',', '.'));
        if (imovelData.price && isNaN(valorNumerico)) {
            novosErros.price = 'Informe um valor válido.';
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
            bedrooms: parseNum(imovelData.bedrooms),
            bathrooms: parseNum(imovelData.bathrooms),
            garages: parseNum(imovelData.garages),
            area: parseFloatNum(imovelData.area),
            price: parseFloatNum(imovelData.price),
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

            if (!result.canceled) {
                const uri = result.assets?.[0]?.uri;
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

    const uploadImageToFirebase = async (uri: string, path: string): Promise<string> => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, blob);
        return await getDownloadURL(storageRef);
    };

    const savePropertyToFirestore = async (data: any) => {
        const docRef = await addDoc(collection(firestore, 'properties'), data);
        return docRef.id;
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
            if (!user) {
                Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
                setLoading(false);
                return;
            }

            const userEmail = user.email;

            const dados = formatarDadosParaEnvio();
            const uploadedPhotos = await Promise.all(
                photos.map((photo, index) => uploadImageToFirebase(photo, `properties/${imovelData.title}/photo_${index + 1}`))
            );

            const payload = { ...dados, transactionType, photos: uploadedPhotos, userEmail };
            const propertyId = await savePropertyToFirestore(payload);

            Alert.alert('Sucesso', `Imóvel cadastrado com sucesso! ID: ${propertyId}`, [{ text: 'OK', onPress: () => navigation.goBack() }]);
            setImovelData(INITIAL_IMOVEL_DATA);
            setErros({});
            setTransactionType('');
            setPhotos([]);
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
                    style={[styles.input, erros.title && styles.inputError]}
                    placeholder="Título do imóvel *"
                    value={imovelData.title}
                    onChangeText={text => updateImovelData('title', text)}
                    editable={!loading}
                    returnKeyType="next"
                />
                {erros.title ? <Text style={styles.errorText}>{erros.title}</Text> : null}
                <TextInput
                    style={[styles.input, erros.address && styles.inputError]}
                    placeholder="Endereço completo *"
                    value={imovelData.address}
                    onChangeText={text => updateImovelData('address', text)}
                    editable={!loading}
                    returnKeyType="next"
                />
                {erros.address ? <Text style={styles.errorText}>{erros.address}</Text> : null}
                <TextInput
                    style={[styles.input, erros.type && styles.inputError]}
                    placeholder="Tipo (Casa, Apartamento, etc.) *"
                    value={imovelData.type}
                    onChangeText={text => updateImovelData('type', text)}
                    editable={!loading}
                    returnKeyType="next"
                />
                {erros.type ? <Text style={styles.errorText}>{erros.type}</Text> : null}
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
                        style={[styles.input, styles.halfInput, erros.bedrooms && styles.inputError]}
                        placeholder="Quartos"
                        keyboardType="number-pad"
                        value={imovelData.bedrooms}
                        onChangeText={text => updateImovelData('bedrooms', text)}
                        editable={!loading}
                        returnKeyType="next"
                    />
                    <TextInput
                        style={[styles.input, styles.halfInput, erros.bathrooms && styles.inputError]}
                        placeholder="Banheiros"
                        keyboardType="number-pad"
                        value={imovelData.bathrooms}
                        onChangeText={text => updateImovelData('bathrooms', text)}
                        editable={!loading}
                        returnKeyType="next"
                    />
                </View>
                <View style={styles.rowInputs}>
                    <View style={styles.halfInputContainer}>{erros.bedrooms ? <Text style={styles.errorText}>{erros.bedrooms}</Text> : null}</View>
                    <View style={styles.halfInputContainer}>{erros.bathrooms ? <Text style={styles.errorText}>{erros.bathrooms}</Text> : null}</View>
                </View>

                <View style={styles.rowInputs}>
                    <TextInput
                        style={[styles.input, styles.halfInput, erros.garages && styles.inputError]}
                        placeholder="Garagens"
                        keyboardType="number-pad"
                        value={imovelData.garages}
                        onChangeText={text => updateImovelData('garages', text)}
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
                    <View style={styles.halfInputContainer}>{erros.garages ? <Text style={styles.errorText}>{erros.garages}</Text> : null}</View>
                    <View style={styles.halfInputContainer}>{erros.area ? <Text style={styles.errorText}>{erros.area}</Text> : null}</View>
                </View>

                <TextInput
                    style={[styles.input, erros.price && styles.inputError]}
                    placeholder="Valor (R$)"
                    keyboardType="decimal-pad"
                    value={imovelData.price}
                    onChangeText={text => updateImovelData('price', text)}
                    editable={!loading}
                    returnKeyType="next"
                />
                {erros.price ? <Text style={styles.errorText}>{erros.price}</Text> : null}
                <TextInput
                    style={[styles.input, styles.textArea, erros.description && styles.inputError]}
                    placeholder="Descrição do imóvel"
                    multiline
                    numberOfLines={4}
                    value={imovelData.description}
                    onChangeText={text => updateImovelData('description', text)}
                    editable={!loading}
                    returnKeyType="default"
                />
                {erros.description ? <Text style={styles.errorText}>{erros.description}</Text> : null}
                <TextInput
                    style={[styles.input, styles.textArea, erros.additionalInformation && styles.inputError]}
                    placeholder="Informações adicionais (mobília, condomínio, IPTU, etc.)"
                    multiline
                    numberOfLines={4}
                    value={imovelData.additionalInformation}
                    onChangeText={text => updateImovelData('additionalInformation', text)}
                    editable={!loading}
                    returnKeyType="done"
                />
                {erros.additionalInformation ? <Text style={styles.errorText}>{erros.additionalInformation}</Text> : null}
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
        paddingTop: 60,
        paddingBottom: 130,
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

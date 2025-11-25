import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Button, Modal, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenBackground from '../../components/common/ScreenBackground';
import PropertyCard, { Property } from '../../components/common/PropertyCard';
import { COLORS } from '../../constants/colors';
import { CameraView, useCameraPermissions } from "expo-camera"
import { useFavorites } from '../../hooks/UseFavorites';

export default function ExploreScreen({ navigation }: any) {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [numBedrooms, setNumBedrooms] = useState('');
    const [numBathrooms, setNumBathrooms] = useState('');
    const [numGarages, setNumGarages] = useState('');
    const [filtersVisible, setFiltersVisible] = useState(false);

    const { favoritedIds, toggleFavorite, isPropertyFavorite } = useFavorites();

    const categories = ['Todos', 'Casa', 'Apartamento', 'Casa de Campo'];

    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    // Animação para os filtros
    const filterAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(filterAnimation, {
            toValue: filtersVisible ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [filtersVisible]);

    const filterHeight = filterAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200], // Altura aproximada dos filtros
    });

    const opacity = filterAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch('https://habitta-mobile.onrender.com/properties');
                const data = await response.json();
                setProperties(data);
            } catch (error) {
                console.error('Erro ao buscar propriedades:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    const filteredProperties = useMemo(() => {
        let filtered = [...properties];
        if (selectedCategory !== 'Todos') {
            filtered = filtered.filter(prop => prop.type === selectedCategory);
        }
        if (searchText) {
            const lowercasedSearchText = searchText.toLowerCase();
            filtered = filtered.filter(prop =>
                (prop.title && prop.title.toLowerCase().includes(lowercasedSearchText)) ||
                (prop.description && prop.description.toLowerCase().includes(lowercasedSearchText)) ||
                (prop.address && prop.address.toLowerCase().includes(lowercasedSearchText))
            );
        }
        if (minPrice !== '') {
            const min = Number(minPrice);
            if (!isNaN(min)) {
                filtered = filtered.filter(prop => prop.price >= min);
            }
        }
        if (maxPrice !== '') {
            const max = Number(maxPrice);
            if (!isNaN(max)) {
                filtered = filtered.filter(prop => prop.price <= max);
            }
        }
        if (numBedrooms !== '') {
            const bedrooms = Number(numBedrooms);
            if (!isNaN(bedrooms) && bedrooms > 0) {
                filtered = filtered.filter(prop => prop.bedrooms && prop.bedrooms >= bedrooms);
            }
        }
        if (numBathrooms !== '') {
            const bathrooms = Number(numBathrooms);
            if (!isNaN(bathrooms) && bathrooms > 0) {
                filtered = filtered.filter(prop => prop.bathrooms && prop.bathrooms >= bathrooms);
            }
        }
        if (numGarages !== '') {
            const garages = Number(numGarages);
            if (!isNaN(garages) && garages > 0) {
                filtered = filtered.filter(prop => prop.garages && prop.garages >= garages);
            }
        }
        return filtered;
    }, [properties, selectedCategory, searchText, minPrice, maxPrice, numBedrooms, numBathrooms, numGarages]);

    const handlePropertyPress = (property: Property) => {
        navigation.navigate('PropertyDetails', { property });
        console.log(property)
    };

    const handleFavoritePress = async (property: Property) => {
        await toggleFavorite(property);
    };

    const [modalIsVisible, setModalIsVisible] = useState(false)
    const [permission, requestPermission] = useCameraPermissions()

    const qrCodeLock = useRef(false)

    async function handleOpenCamera() {
        try {
            const { granted } = await requestPermission()

            if (!granted) {
                return Alert.alert("Camera", "Habilite o uso da câmera.")
            }

            setModalIsVisible(true)
            qrCodeLock.current = false
        } catch (error) {
            console.log(error)
        }
    }

    // REDIRECIONAMENTO POR LEITURA DE QRcode:
    async function handleQRCodeRead(data: string) {
        setModalIsVisible(false)
        console.log("QR Code Lido (Dado): ", data);
        const propertyId = data;

        if (!propertyId) {
            return Alert.alert("Erro: ", "O identificador do Imóvel não foi encontrado.");
        }

        try {
            const response = await fetch(`https://habitta-mobile.onrender.com/properties/${propertyId}`);

            if (!response.ok) {
                throw new Error(`Imóvel não encontrado. Status: ${response.status}`);
            }
            const propertyData: Property = await response.json();
            navigation.navigate('PropertyDetails', { property: propertyData });

        } catch (error) {
            console.error('Erro ao buscar imóvel do QR Code:', error);
            Alert.alert("Erro", "Não foi possível carregar os detalhes do imóvel.");
        }
    }

    return (
        <ScreenBackground style={styles.container}>
            {/* Header com título, botão QR Code e botão Filtros */}
            <View style={styles.header}>
                <Text style={styles.pageTitle}>Explore Imóveis</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        style={styles.qrCodeButton}
                        onPress={handleOpenCamera}
                    >
                        <Ionicons name="qr-code" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={styles.filtersButton}
                        onPress={() => setFiltersVisible(!filtersVisible)}
                    >
                        <Text style={styles.filtersButtonText}>
                            {filtersVisible ? "Fechar" : "Filtros"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Modal do QR Code */}
            <Modal visible={modalIsVisible} style={{ flex: 1 }}>
                <CameraView
                    style={{ flex: 1 }}
                    facing="back"
                    onBarcodeScanned={({ data }) => {
                        if (data && !qrCodeLock.current) {
                            qrCodeLock.current = true
                            setTimeout(() => handleQRCodeRead(data), 500)
                        }
                    }}
                />

                <View style={styles.footer}>
                    <Button title="Cancelar" onPress={() => setModalIsVisible(false)} />
                </View>
            </Modal>

            {/* Campo de pesquisa (sempre visível) */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Procure por título, descrição ou localização"
                    placeholderTextColor={COLORS.gray}
                    onChangeText={setSearchText}
                    value={searchText}
                />
            </View>

            {/* Filtros animados (ocultáveis) */}
            <Animated.View style={[styles.filtersContainer, {
                height: filterHeight,
                opacity: opacity
            }]}>
                <View style={styles.priceFilterContainer}>
                    <TextInput
                        style={styles.priceInput}
                        placeholder="Preço Mínimo"
                        placeholderTextColor={COLORS.gray}
                        keyboardType="numeric"
                        onChangeText={setMinPrice}
                        value={minPrice}
                    />
                    <Text style={styles.priceSeparator}>-</Text>
                    <TextInput
                        style={styles.priceInput}
                        placeholder="Preço Máximo"
                        placeholderTextColor={COLORS.gray}
                        keyboardType="numeric"
                        onChangeText={setMaxPrice}
                        value={maxPrice}
                    />
                </View>

                <View style={styles.numberContainer}>
                    <TextInput
                        style={[styles.numberInput, { maxWidth: '30%' }]}
                        placeholder="Quartos"
                        placeholderTextColor={COLORS.gray}
                        keyboardType="numeric"
                        onChangeText={setNumBedrooms}
                        value={numBedrooms}
                    />

                    <TextInput
                        style={[styles.numberInput, { maxWidth: '30%' }]}
                        placeholder="Banheiros"
                        placeholderTextColor={COLORS.gray}
                        keyboardType="numeric"
                        onChangeText={setNumBathrooms}
                        value={numBathrooms}
                    />

                    <TextInput
                        style={[styles.numberInput, { maxWidth: '30%' }]}
                        placeholder="Vagas"
                        placeholderTextColor={COLORS.gray}
                        keyboardType="numeric"
                        onChangeText={setNumGarages}
                        value={numGarages}
                    />
                </View>

                <View style={styles.categoryContainer}>
                    <FlatList
                        data={categories}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => {
                            const isSelected = selectedCategory === item;
                            return (
                                <TouchableOpacity
                                    onPress={() => setSelectedCategory(item)}
                                    style={[styles.categoryBtn, isSelected && styles.categoryBtnSelected]}
                                >
                                    <Text style={[styles.categoryTxt, isSelected && styles.categoryTxtSelected]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            </Animated.View>

            {loading ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Carregando imóveis...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredProperties}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <PropertyCard
                            property={item}
                            onPress={() => handlePropertyPress(item)}
                            onFavoritePress={() => handleFavoritePress(item)}
                            isFavorite={isPropertyFavorite(item.id)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.flatlistContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Nenhum imóvel encontrado.</Text>
                        </View>
                    }
                />
            )}
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    pageTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        flex: 1,
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qrCodeButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        padding: 8, // Padding igual em todos os lados
        borderRadius: 8,
        marginRight: 10,
        width: 40, // Largura fixa para manter o tamanho
        height: 40, // Altura fixa para manter o tamanho
    },
    filtersButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderRadius: 8,
        justifyContent: 'center',
    },
    filtersButtonText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '800',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: '#efefef',
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: COLORS.text,
    },
    filtersContainer: {
        overflow: 'hidden',
        marginBottom: 1, // REDUZIDO: de 10 para 5 (menor distância para as propriedades)
    },
    priceFilterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'space-between',
    },
    priceInput: {
        flex: 1,
        borderRadius: 12,
        backgroundColor: COLORS.white,
        fontSize: 16,
        color: COLORS.text,
        width: 'auto',
        paddingLeft: 10,
        maxWidth: '45%',
        height: 50,
        borderWidth: 1,
        borderColor: '#efefef',
    },
    priceSeparator: {
        marginHorizontal: 10,
        color: COLORS.text,
        fontSize: 18,
    },
    numberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderRadius: 12,
        marginBottom: 10,
        justifyContent: 'space-between',
    },
    numberInput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: COLORS.text,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: '#efefef',
        paddingLeft: 10,
        borderRadius: 12,
    },
    categoryContainer: {
        marginTop: 10,
        marginBottom: 10,
        height: 45,
    },
    categoryBtn: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 1,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    categoryBtnSelected: {
        backgroundColor: COLORS.primary,
    },
    categoryTxt: {
        color: '#888888',
        fontWeight: '500',
        fontSize: 13,
    },
    categoryTxtSelected: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    flatlistContent: {
        paddingBottom: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: COLORS.text,
        fontSize: 18,
    },
    footer: {
        position: "absolute",
        bottom: 32,
        left: 32,
        right: 32,
    },
});
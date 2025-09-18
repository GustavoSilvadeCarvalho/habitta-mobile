import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenBackground from '../../components/common/ScreenBackground';
import PropertyCard, { Property } from '../../components/common/PropertyCard';
import { COLORS } from '../../constants/colors';

import { useFavorites } from '../../hooks/UseFavorites';

export default function ExploreScreen({ navigation }: any) {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const { favoritedIds, toggleFavorite, isPropertyFavorite } = useFavorites();

    const categories = ['All', 'House', 'Apartment', 'Farm House', 'Shop', 'Villa', 'Condo'];

    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch('http://localhost:3001/properties');
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
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(prop => prop.type === selectedCategory);
        }
        if (searchText) {
            const lowercasedSearchText = searchText.toLowerCase();
            filtered = filtered.filter(prop =>
                (prop.title && prop.title.toLowerCase().includes(lowercasedSearchText)) ||
                (prop.description && prop.description.toLowerCase().includes(lowercasedSearchText))
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
        return filtered;
    }, [properties, selectedCategory, searchText, minPrice, maxPrice]);

    const handlePropertyPress = (property: Property) => {
        navigation.navigate('PropertyDetails', { property });
    };

    const handleFavoritePress = async (property: Property) => {
        await toggleFavorite(property);
    };

    return (
        <ScreenBackground style={styles.container}>
            <Text style={styles.pageTitle}>Explore Imóveis</Text>

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
        paddingTop: 65,
        paddingHorizontal: 16,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: COLORS.text,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
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
    priceFilterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'space-between',
    },
    priceInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 15,
        borderRadius: 12,
        backgroundColor: COLORS.white,
        fontSize: 16,
        color: COLORS.text,
    },
    priceSeparator: {
        marginHorizontal: 10,
        color: COLORS.text,
        fontSize: 18,
    },
    categoryContainer: {
        marginTop: 10,
        marginBottom: 10,
        height: 50,
    },
    categoryBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 5,
        borderRadius: 20,
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
});
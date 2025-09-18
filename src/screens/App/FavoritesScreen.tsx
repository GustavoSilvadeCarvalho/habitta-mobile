import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import ScreenBackground from '../../components/common/ScreenBackground';
import PropertyCard, { Property } from '../../components/common/PropertyCard';
import { MOCKED_PROPERTIES } from '../../data/mocks/properties';
import { useFavorites } from '../../hooks/UseFavorites';

export default function FavoritesScreen({ navigation }: any) {
    const { favoritedIds, toggleFavorite, clearAllFavorites } = useFavorites();
    const [savedProperties, setSavedProperties] = useState<Property[]>([]);

    // Carregar imóveis salvos quando os favoritos mudarem
    useEffect(() => {
        const filteredProperties = MOCKED_PROPERTIES.filter(property => 
            favoritedIds.includes(property.id)
        );
        setSavedProperties(filteredProperties);
    }, [favoritedIds]);

    const handleFavoritePress = async (property: Property) => {
        await toggleFavorite(property);
    };

    const handlePropertyPress = (property: Property) => {
        navigation.navigate('PropertyDetails', { property });
    };

    return (
        <ScreenBackground style={styles.container}>
            <Text style={styles.pageTitle}>Imóveis Salvos</Text>
            
            {savedProperties.length > 0 && (
                <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={clearAllFavorites}
                >
                    <Text style={styles.clearButtonText}>Limpar Todos</Text>
                </TouchableOpacity>
            )}
            
            {savedProperties.length === 0 ? (
                <Text style={styles.emptyMessage}>
                    Você ainda não salvou nenhum imóvel
                </Text>
            ) : (
                <>
                    <Text style={styles.countText}>
                        {savedProperties.length} imóvel(s) salvo(s)
                    </Text>
                    
                    <FlatList
                        data={savedProperties}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <PropertyCard
                                property={item}
                                onPress={() => handlePropertyPress(item)}
                                onFavoritePress={() => handleFavoritePress(item)}
                                isFavorite={favoritedIds.includes(item.id)}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.flatlistContent}
                    />
                </>
            )}
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 65,
        paddingHorizontal: 16,
        backgroundColor: COLORS.background,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: COLORS.text,
    },
    flatlistContent: {
        paddingBottom: 20,
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 16,
        color: COLORS.gray,
        marginTop: 50,
    },
    countText: {
        fontSize: 14,
        color: COLORS.gray,
        marginBottom: 10,
    },
    clearButton: {
        backgroundColor: COLORS.secondary,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    clearButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
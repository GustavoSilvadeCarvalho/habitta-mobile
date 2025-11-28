import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ScreenBackground from '../../components/common/ScreenBackground';
import PropertyCard, { Property } from '../../components/common/PropertyCard';
import { COLORS } from '../../constants/colors';
import { useFavorites } from '../../hooks/UseFavorites';

export default function RentScreen({ navigation }: any) {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    const { toggleFavorite, isPropertyFavorite } = useFavorites();

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

    const isRentProperty = (prop: any) => {
        if (!prop) return false;
        if (prop.transaction === 'rent' || prop.transactionType === 'rent' || prop.purpose === 'rent') return true;
        if (prop.isForRent === true) return true;
        if (prop.listing_type === 'rent' || prop.listingType === 'rent') return true;
        if (prop.operation === 'rent' || prop.offerType === 'rent') return true;
        return false;
    };

    const rentProperties = properties.filter(isRentProperty);

    const handlePropertyPress = (property: Property) => {
        navigation.navigate('PropertyDetails', { property });
    };

    const handleFavoritePress = async (property: Property) => {
        await toggleFavorite(property);
    };

    return (
        <ScreenBackground style={styles.container}>
            <Text style={styles.pageTitle}>Imóveis para Aluguel</Text>

            {loading ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Carregando imóveis...</Text>
                </View>
            ) : (
                <FlatList
                    data={rentProperties}
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
                            <Text style={styles.emptyText}>Nenhum imóvel para aluguel encontrado.</Text>
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

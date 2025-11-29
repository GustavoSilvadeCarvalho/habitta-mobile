import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ScreenBackground from '../../components/common/ScreenBackground';
import { COLORS } from '../../constants/colors';
import { useFavorites } from '../../hooks/UseFavorites';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../../firebaseConfig';
import { Property } from '../../interface/IProperty';
import PropertyCardSale from '../../components/common/PropertyCardSale';

export default function SalesScreen({ navigation }: any) {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    const { toggleFavorite, isPropertyFavorite } = useFavorites();

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const db = getFirestore(firebaseApp);
                const propertiesCollection = collection(db, 'properties');
                const querySnapshot = await getDocs(propertiesCollection);
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    image_url: doc.data().photos[0].toString()||'', // Garante que seja uma string
                    image_Array: doc.data().photos || [],
                    title: doc.data().title || '',
                    price: doc.data().price || 0,
                    bedrooms: doc.data().bedrooms || 0,
                    bathrooms: doc.data().bathrooms || 0,
                    garages: doc.data().garages || 0,
                    address: doc.data().address || '',
                    description: doc.data().description || '',
                    type: doc.data().type || '',
                    area: doc.data().area || 0,
                    location: doc.data().location || '',
                    transaction: doc.data().transactionType || '',
                }));
                console.log('Propriedades buscadas do Firebase:', data);
                setProperties(data);
            } catch (error) {
                console.error('Erro ao buscar propriedades do Firebase:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    const saleProperties = properties

    console.log('Propriedades filtradas para venda1:', saleProperties);

    const handlePropertyPress = (property: Property) => {
        navigation.navigate('PropertyDetails', { property });
    };

    const handleFavoritePress = async (property: Property) => {
        await toggleFavorite(property);
    };

    return (
        <ScreenBackground style={styles.container}>
            <Text style={styles.pageTitle}>Imóveis à Venda</Text>

            {loading ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Carregando imóveis...</Text>
                </View>
            ) : (
                <FlatList
                    data={saleProperties}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <PropertyCardSale
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
                            <Text style={styles.emptyText}>Nenhum imóvel de venda encontrado.</Text>
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

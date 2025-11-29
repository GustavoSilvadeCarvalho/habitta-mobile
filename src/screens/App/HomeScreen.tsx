import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/colors';
import ScreenBackground from '../../components/common/ScreenBackground';
import PropertyCard from '../../components/common/PropertyCard';
import { Property } from '../../interface/IProperty';
import { MOCKED_PROPERTIES } from '../../data/mocks/properties';
import { Ionicons } from '@expo/vector-icons';
import useLocation from '../../hooks/useLocation';
import { useFavorites } from '../../hooks/UseFavorites';

const { width } = Dimensions.get('window');
const cardMargin = 16;
const cardWidth = width - (cardMargin * 2);

export default function HomeScreen({ navigation }: any) {
    const { logout } = useContext(AuthContext);
    const { location, errorMsg } = useLocation();
    const { toggleFavorite, isPropertyFavorite } = useFavorites();

    const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    const handleFavoritePress = useCallback(async (property: Property) => {
        await toggleFavorite(property);
    }, [toggleFavorite]);

    const handlePropertyPress = useCallback((property: Property) => {
        navigation.navigate('PropertyDetails', { property });
    }, [navigation]);

    useEffect(() => {
        // Simulating a fetch call
        setTimeout(() => {
            setFeaturedProperties(MOCKED_PROPERTIES);
            setLoading(false);
        }, 1000);
    }, []);

    const renderItem = useCallback(({ item }: { item: Property }) => (
        <PropertyCard
            property={item}
            onPress={() => handlePropertyPress(item)}
            onFavoritePress={() => handleFavoritePress(item)}
            isFavorite={isPropertyFavorite(item.id)}
        />
    ), [handlePropertyPress, handleFavoritePress, isPropertyFavorite]);

    return (
        <ScreenBackground style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText} accessibilityRole="header">Bem-vindo(a)!</Text>
                <TouchableOpacity 
                    onPress={logout} 
                    style={styles.logoutButton}
                    accessibilityRole="button"
                    accessibilityLabel="Sair"
                    accessibilityHint="Toque duas vezes para deslogar da sua conta"
                >
                    <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <View style={styles.locationContainer}>
                <Ionicons name="location-sharp" size={16} color={COLORS.text} />
                <Text 
                    style={styles.locationText} 
                    numberOfLines={1} 
                    ellipsizeMode="tail"
                    accessibilityLabel={`Sua localização atual é ${location || errorMsg || "não detectada"}`}
                >
                    {location || errorMsg || "Carregando..."}
                </Text>
            </View>

            <Text style={styles.sectionTitle} accessibilityRole="header">Imóveis em Destaque</Text>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
            ) : (
                <FlatList
                    data={featuredProperties}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.flatlistContent}
                    initialNumToRender={5}
                    maxToRenderPerBatch={10}
                    windowSize={11}
                    getItemLayout={(data, index) => (
                        { length: cardWidth + 20, offset: (cardWidth + 20) * index, index }
                    )}
                />
            )}
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: cardMargin,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    logoutButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: COLORS.secondary,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        marginBottom: 16,
    },
    locationText: {
        fontSize: 14,
        color: COLORS.text,
        marginLeft: 8,
        flex: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: COLORS.text,
    },
    flatlistContent: {
        paddingBottom: 100,
    },
    loader: {
        marginTop: 50,
    }
});
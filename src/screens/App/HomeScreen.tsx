import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/colors';
import ScreenBackground from '../../components/common/ScreenBackground';
import PropertyCard, { Property } from '../../components/common/PropertyCard';
import { MOCKED_PROPERTIES } from '../../data/mocks/properties';
import { Ionicons } from '@expo/vector-icons';
import useLocation from '../../hooks/useLocation';
import { useFavorites } from '../../hooks/UseFavorites';

export default function HomeScreen({ navigation }: any) {
    const { user, logout } = useContext(AuthContext);
    const { location, errorMsg } = useLocation();
    const { toggleFavorite, isPropertyFavorite } = useFavorites();

    const handleFavoritePress = async (property: Property) => {
    await toggleFavorite(property);
    };

    const handlePropertyPress = (property: Property) => {
        navigation.navigate('PropertyDetails', { property });
    };
    
    // vai exibir até 5 imóveis em destaque; podemos decidir o design melhor futuramente
    const featuredProperties = MOCKED_PROPERTIES.slice(0, 5);

    return (
        <ScreenBackground style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Bem-vindo(a),</Text>
                    <Text style={styles.userName}>{user?.name}!</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Sair</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.locationContainer}>
                <Ionicons name="location-sharp" size={16} color={COLORS.text} />
                <Text style={styles.locationText}>{location || errorMsg || "Carregando..."}</Text>
            </View>
            
            <Text style={styles.sectionTitle}>Imóveis em Destaque</Text>

            <FlatList
                data={featuredProperties}
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
            />
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 65,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    welcomeText: {
        fontSize: 18,
        color: COLORS.text,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    logoutButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: COLORS.secondary,
    },
    logoutButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    locationText: {
        fontSize: 16,
        color: COLORS.text,
        marginLeft: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: COLORS.text,
    },
    flatlistContent: {
        paddingBottom: 20,
    },
});
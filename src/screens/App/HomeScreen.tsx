import React, { useContext, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/colors';
import useLocation from '../../hooks/useLocation';
import { Ionicons } from '@expo/vector-icons';
import ScreenBackground from '../../components/common/ScreenBackground';
import PropertyCard, { Property } from '../../components/common/PropertyCard';
import { MOCKED_PROPERTIES } from '../../data/mocks/properties';

export default function HomeScreen({ navigation }: any) {
    const { user, logout } = useContext(AuthContext);
    const { location, errorMsg } = useLocation();

    const categories = ['All', 'House', 'Apartment', 'Farm House', 'Shop', 'Villa', 'Condo'];
    const [selectedCategory, setSelectedCategory] = useState('All');

    const [favoritedIds, setFavoritedIds] = useState<string[]>([]);

    const renderLocation = () => {
        if (errorMsg) {
            return <Text style={styles.locationText}>{errorMsg}</Text>;
        }
        if (location) {
            return (
                <View style={styles.locationContainer}>
                    <Ionicons name="location-sharp" size={16} color={COLORS.text} />
                    <Text style={styles.locationText}> {location}</Text>
                </View>
            );
        }
        return <ActivityIndicator color={COLORS.text} />;
    };

    const handleFavoritePress = (property: Property) => {
        const isAlreadyFavorite = favoritedIds.includes(property.id);

        if (isAlreadyFavorite) {
            console.log(`Desfavoritou: ${property.title}`);
        } else {
            console.log(`Favoritou: ${property.title}`);
        }

        setFavoritedIds(prevIds => {
            if (isAlreadyFavorite) {
                return prevIds.filter(id => id !== property.id);
            } else {
                return [...prevIds, property.id];
            }
        });
    }

    const handlePropertyPress = (property: Property) => {
        navigation.navigate('PropertyDetails', { property });
    }

    return (
        <ScreenBackground style={styles.container}>
            <Button title="Sair" onPress={logout} color={COLORS.secondary} />
            <Text style={styles.title}>Bem-vindo(a), {user?.name}!</Text>
            {renderLocation()}

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Procure casas, apartamentos..."
                    placeholderTextColor={COLORS.gray}
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
                                style={[
                                    styles.categoryBtn,
                                    isSelected && styles.categoryBtnSelected
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.categoryTxt,
                                        isSelected && styles.categoryTxtSelected
                                    ]}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            <FlatList
                data={MOCKED_PROPERTIES}
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
            />
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 65,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        padding: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    locationText: {
        fontSize: 16,
        color: COLORS.text,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginHorizontal: 8,
        marginTop: 20,
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
    categoryContainer: {
        marginTop: 20,
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
});
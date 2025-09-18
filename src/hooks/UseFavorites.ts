// hooks/useFavorites.ts
//import { useFavorites } from '../../hooks/UseFavorites';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { Property } from '../components/common/PropertyCard';

const FAVORITES_KEY = '@favorited_properties';

export const useFavorites = () => {
    const [favoritedIds, setFavoritedIds] = useState<string[]>([]);

    // Carregar favoritos ao iniciar
    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const savedIds = await AsyncStorage.getItem(FAVORITES_KEY);
            if (savedIds) {
                setFavoritedIds(JSON.parse(savedIds));
            }
        } catch (error) {
            console.error('Erro ao carregar favoritos:', error);
        }
    };

    const toggleFavorite = async (property: Property) => {
        // Declara a variável fora do try para que fique disponível no catch
        let isAlreadyFavorite = favoritedIds.includes(property.id);
        
        try {
            let newFavoritedIds: string[];

            if (isAlreadyFavorite) {
                newFavoritedIds = favoritedIds.filter(id => id !== property.id);
            } else {
                newFavoritedIds = [...favoritedIds, property.id];
            }

            setFavoritedIds(newFavoritedIds);
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavoritedIds));

            Alert.alert(
                isAlreadyFavorite ? 'Removido' : 'Salvo!',
                isAlreadyFavorite 
                    ? 'Imóvel removido dos salvos' 
                    : 'Imóvel salvo com sucesso!'
            );

            return !isAlreadyFavorite; // Retorna o novo estado

        } catch (error) {
            console.error('Erro ao salvar imóvel:', error);
            Alert.alert('Erro', 'Não foi possível salvar o imóvel');
            return isAlreadyFavorite; // Retorna o estado anterior em caso de erro
        }
    };

    const isPropertyFavorite = (propertyId: string) => {
        return favoritedIds.includes(propertyId);
    };

    const clearAllFavorites = async () => {
        try {
            await AsyncStorage.removeItem(FAVORITES_KEY);
            setFavoritedIds([]);
            Alert.alert('Sucesso', 'Todos os imóveis foram removidos');
        } catch (error) {
            console.error('Erro ao limpar favoritos:', error);
            Alert.alert('Erro', 'Não foi possível limpar os imóveis');
        }
    };

    return {
        favoritedIds,
        toggleFavorite,
        isPropertyFavorite,
        clearAllFavorites,
        loadFavorites
    };
};
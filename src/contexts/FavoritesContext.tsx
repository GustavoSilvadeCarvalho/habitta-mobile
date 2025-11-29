import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { Alert } from 'react-native';
import { Property } from '../components/common/PropertyCard';


interface FavoritesContextType {
    favoritedIds: string[];
    toggleFavorite: (property: Property) => Promise<boolean>;
    isPropertyFavorite: (propertyId: string) => boolean;
    loadFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);


interface FavoritesProviderProps {
    children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [favoritedIds, setFavoritedIds] = useState<string[]>([]);
    const userId = user?.id || null;

  useEffect(() => {
        import('../contexts/AuthContext').then(({ AuthContext }) => {
            // Precisa ser usado dentro de um componente React
            // Alternativamente, pode ser passado como prop
        });
    }, []);

    useEffect(() => {
        if (userId) {
            loadFavorites();
        } else {
            setFavoritedIds([]);
        }
    }, [userId]);

    const loadFavorites = async () => {
        if (!userId) return;
        try {
            const response = await fetch(`https://habitta-mobile.onrender.com/favorites/${userId}`);
            const data = await response.json();
            setFavoritedIds(data.map((property: any) => property.id));
        } catch (error) {
            console.error('Erro ao carregar favoritos:', error);
        }
    };

    const toggleFavorite = async (property: Property) => {
        if (!userId) return false;
        const isAlreadyFavorite = favoritedIds.includes(property.id);
        try {
            if (isAlreadyFavorite) {
                await fetch('https://habitta-mobile.onrender.com/favorites', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, propertyId: property.id })
                });
                setFavoritedIds(favoritedIds.filter(id => id !== property.id));
                Alert.alert('Removido', 'Imóvel removido dos favoritos');
            } else {
                await fetch('https://habitta-mobile.onrender.com/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, propertyId: property.id })
                });
                setFavoritedIds([...favoritedIds, property.id]);
                Alert.alert('Salvo!', 'Imóvel salvo com sucesso!');
            }
            return !isAlreadyFavorite;
        } catch (error) {
            console.error('Erro ao salvar/remover favorito:', error);
            Alert.alert('Erro', 'Não foi possível salvar/remover o imóvel');
            return isAlreadyFavorite;
        }
    };

    const isPropertyFavorite = (propertyId: string) => {
        return favoritedIds.includes(propertyId);
    };


    const value: FavoritesContextType = {
        favoritedIds,
        toggleFavorite,
        isPropertyFavorite,
        loadFavorites
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavoritesContext = () => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavoritesContext deve ser usado dentro de um FavoritesProvider');
    }
    return context;
};

import React from 'react';
import { View, Text, Image, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { cardStyles } from '../Styles/CardStyle';
import { Property } from '../../interface/IProperty';
    

interface PropertyCardProps {
    property: Property;
    onPress?: () => void;
    onFavoritePress?: () => void;
    isFavorite?: boolean;
}

const PropertyCard = ({ property, onPress, onFavoritePress, isFavorite }: PropertyCardProps) => {
    const { width: windowWidth } = useWindowDimensions();
    
    // Definição de breakpoints para diferentes tamanhos de tela
    const isSmallScreen = windowWidth < 375; // iPhone SE e menores
    const isMediumScreen = windowWidth < 414; // iPhone 11 Pro e similares
    
    // Função para determinar o tamanho da fonte baseado na largura da tela
    const getResponsiveFontSize = () => {
        if (isSmallScreen) {
            return 14; // Tamanho menor para telas muito pequenas
        } else if (isMediumScreen) {
            return 16; // Tamanho médio para telas médias
        } else {
            return 18; // Tamanho padrão para telas maiores
        }
    };

    const titlePriceFontSize = getResponsiveFontSize();

    const handleFavorite = (event: GestureResponderEvent) => {
        event.stopPropagation();
        if (onFavoritePress) {
            onFavoritePress();
        }
    };

    const accessibilityLabel = `Imóvel: ${property.title}. Preço: ${property.price} por semana. ${property.bedrooms} quartos, ${property.bathrooms} banheiros. Localizado em ${property.address}.`;
    const favoriteHint = isFavorite ? "Toque para remover dos favoritos" : "Toque para adicionar aos favoritos";

    return (
        <TouchableOpacity 
            style={cardStyles.cardContainer} 
            onPress={onPress} 
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            accessibilityHint="Toque para ver mais detalhes."
        >

            <Image source={{ uri: property.image_url }} style={cardStyles.image} accessibilityIgnoresInvertColors />

            <TouchableOpacity 
                style={cardStyles.favoriteIcon} 
                onPress={handleFavorite}
                accessibilityRole="button"
                accessibilityLabel={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                accessibilityHint={favoriteHint}
            >
                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={COLORS.white} />
            </TouchableOpacity>

            <View style={cardStyles.contentContainer} importantForAccessibility="no-hide-descendants">
                <View style={cardStyles.titlePriceRow}>
                    <Text style={cardStyles.title}>{property.title}</Text>
                    <Text style={cardStyles.price}>$ {property.price}</Text>
                </View>

                <View style={cardStyles.featuresRow}>
                    <View style={cardStyles.featureItem}>
                        <Ionicons name="bed-outline" size={16} color={COLORS.textGray} accessible={false} />
                        <Text style={cardStyles.featureText}>{property.bedrooms}</Text>
                    </View>
                    <View style={cardStyles.featureItem}>
                        <Ionicons name="water-outline" size={16} color={COLORS.textGray} accessible={false} />
                        <Text style={cardStyles.featureText}>{property.bathrooms}</Text>
                    </View>
                    <View style={cardStyles.featureItem}>
                        <Ionicons name="car-sport-outline" size={16} color={COLORS.textGray} accessible={false} />
                        <Text style={cardStyles.featureText}>{property.garages}</Text>
                    </View>
                    <Text style={cardStyles.pricePeriod}>Per Week</Text>
                </View>

                <View style={cardStyles.addressRow}>
                    <Ionicons name="location-outline" size={16} color={COLORS.textGray} accessible={false} />
                    <Text style={cardStyles.addressText}>{property.address}</Text>
                </View>

                <Text style={cardStyles.description}>{property.description}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default PropertyCard;

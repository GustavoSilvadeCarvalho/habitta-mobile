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
    const handleFavorite = (event: GestureResponderEvent) => {
        event.stopPropagation();
        if (onFavoritePress) {
            onFavoritePress();
        }
    };

    return (
        <TouchableOpacity style={cardStyles.cardContainer} onPress={onPress} activeOpacity={0.8}>

            <Image source={{ uri: property.image_url }} style={cardStyles.image} />

            <TouchableOpacity style={cardStyles.favoriteIcon} onPress={handleFavorite}>
                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={COLORS.white} />
            </TouchableOpacity>

            <View style={cardStyles.contentContainer}>
                <View style={cardStyles.titlePriceRow}>
                    <Text style={cardStyles.title}>{property.title}</Text>
                    <Text style={cardStyles.price}>$ {property.price}</Text>
                </View>

                <View style={cardStyles.featuresRow}>
                    <View style={cardStyles.featureItem}>
                        <Ionicons name="bed-outline" size={16} color={COLORS.gray} />
                        <Text style={cardStyles.featureText}>{property.bedrooms}</Text>
                    </View>
                    <View style={cardStyles.featureItem}>
                        <Ionicons name="water-outline" size={16} color={COLORS.gray} />
                        <Text style={cardStyles.featureText}>{property.bathrooms}</Text>
                    </View>
                    <View style={cardStyles.featureItem}>
                        <Ionicons name="car-sport-outline" size={16} color={COLORS.gray} />
                        <Text style={cardStyles.featureText}>{property.garages}</Text>
                    </View>
                    <Text style={cardStyles.pricePeriod}>Per Week</Text>
                </View>

                <View style={cardStyles.addressRow}>
                    <Ionicons name="location-outline" size={16} color={COLORS.gray} />
                    <Text style={cardStyles.addressText}>{property.address}</Text>
                </View>

                <Text style={cardStyles.description}>{property.description}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default PropertyCard;

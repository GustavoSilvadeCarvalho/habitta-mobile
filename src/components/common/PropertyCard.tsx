import React from 'react';
import { 
    View, 
    Text, 
    Image, 
    StyleSheet, 
    TouchableOpacity, 
    GestureResponderEvent,
    Dimensions,
    useWindowDimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

export interface Property {
    id: string;
    image_url: string;
    title: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    garages: number;
    address: string;
    description: string;
    type: string;
}

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

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.8}>

            <Image source={{ uri: property.image_url }} style={styles.image} />

            <TouchableOpacity style={styles.favoriteIcon} onPress={handleFavorite}>
                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={COLORS.white} />
            </TouchableOpacity>

            <View style={styles.contentContainer}>
                <View style={styles.titlePriceRow}>
                    <Text style={[styles.title, { fontSize: titlePriceFontSize }]}>{property.title}</Text>
                    <Text style={[styles.price, { fontSize: titlePriceFontSize }]}>R$ {property.price}</Text>
                </View>

                <View style={styles.featuresRow}>
                    <View style={styles.featureItem}>
                        <Ionicons name="bed-outline" size={16} color={COLORS.gray} />
                        <Text style={styles.featureText}>{property.bedrooms}</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="water-outline" size={16} color={COLORS.gray} />
                        <Text style={styles.featureText}>{property.bathrooms}</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="car-sport-outline" size={16} color={COLORS.gray} />
                        <Text style={styles.featureText}>{property.garages}</Text>
                    </View>
                </View>

                <View style={styles.addressRow}>
                    <Ionicons name="location-outline" size={16} color={COLORS.gray} />
                    <Text style={styles.addressText}>{property.address}</Text>
                </View>

                <Text style={styles.description}>{property.description}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default PropertyCard;

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        marginVertical: 10,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    favoriteIcon: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 20,
        padding: 6,
    },
    contentContainer: {
        padding: 15,
    },
    titlePriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start', // Alinha os itens no topo
        marginBottom: 8,
    },
    title: {
        // fontSize removido do StyleSheet e aplicado dinamicamente
        fontWeight: 'bold',
        color: COLORS.text,
        flex: 1, // Permite que o texto quebre linha se necessário
        marginRight: 10,
    },
    price: {
        // fontSize removido do StyleSheet e aplicado dinamicamente
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    featuresRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    featureText: {
        marginLeft: 5,
        color: COLORS.gray,
    },
    pricePeriod: {
        marginLeft: 'auto',
        color: COLORS.gray,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    addressText: {
        marginLeft: 5,
        color: COLORS.gray,
    },
    description: {
        marginTop: 10,
        color: COLORS.text,
        fontSize: 12,
        lineHeight: 18,
    },
});
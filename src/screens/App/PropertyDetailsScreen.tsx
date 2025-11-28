import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import ScreenBackground from '../../components/common/ScreenBackground';
import { Property } from '../../components/common/PropertyCard';

interface PropertyDetailsScreenProps {
    route: {
        params: {
            property: Property;
        };
    };
    navigation: any;
}

export default function PropertyDetailsScreen({ route, navigation }: PropertyDetailsScreenProps) {
    const { property } = route.params;
    const [isFavorite, setIsFavorite] = useState(false);

    const handleFavoritePress = () => {
        setIsFavorite(!isFavorite);
        Alert.alert(
            isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos',
            `${property.title} foi ${isFavorite ? 'removido' : 'adicionado'} aos seus favoritos.`
        );
    };

    const handleContactPress = () => {
        Alert.alert(
            'Contato',
            'Funcionalidade de contato será implementada em breve!',
            [{ text: 'OK' }]
        );
    };

    const handleScheduleVisit = () => {
        Alert.alert(
            'Agendar Visita',
            'Funcionalidade de agendamento será implementada em breve!',
            [{ text: 'OK' }]
        );
    };

    return (
        <ScreenBackground style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header com imagem */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: property.image_url }} style={styles.image} />
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={handleFavoritePress}
                    >
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={24}
                            color={COLORS.white}
                        />
                    </TouchableOpacity>
                </View>

                {/* Conteúdo principal */}
                <View style={styles.contentContainer}>
                    {/* Título e preço */}
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{property.title}</Text>
                        <Text style={styles.price}>$ {property.price}</Text>
                    </View>

                    {/* Endereço */}
                    <View style={styles.addressRow}>
                        <Ionicons name="location-outline" size={20} color={COLORS.gray} />
                        <Text style={styles.address}>{property.address}</Text>
                    </View>

                    {/* Características */}
                    <View style={styles.featuresContainer}>
                        <View style={styles.featureItem}>
                            <Ionicons name="bed-outline" size={24} color={COLORS.primary} />
                            <Text style={styles.featureLabel}>Quartos</Text>
                            <Text style={styles.featureValue}>{property.bedrooms}</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Ionicons name="water-outline" size={24} color={COLORS.primary} />
                            <Text style={styles.featureLabel}>Banheiros</Text>
                            <Text style={styles.featureValue}>{property.bathrooms}</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Ionicons name="car-sport-outline" size={24} color={COLORS.primary} />
                            <Text style={styles.featureLabel}>Garagens</Text>
                            <Text style={styles.featureValue}>{property.garages}</Text>
                        </View>
                    </View>

                    {/* Descrição */}
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionTitle}>Descrição</Text>
                        <Text style={styles.description}>{property.description}</Text>
                    </View>

                    {/* Informações adicionais */}
                    <View style={styles.additionalInfoContainer}>
                        <Text style={styles.additionalInfoTitle}>Informações Adicionais</Text>
                        <View style={styles.infoItem}>
                            <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.primary} />
                            <Text style={styles.infoText}>Mobiliado</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.primary} />
                            <Text style={styles.infoText}>Wi-Fi incluído</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.primary} />
                            <Text style={styles.infoText}>Área de lazer</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.primary} />
                            <Text style={styles.infoText}>Segurança 24h</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Botões de ação fixos */}
            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                    style={styles.contactButton}
                    onPress={handleContactPress}
                >
                    <Ionicons name="call-outline" size={20} color={COLORS.white} />
                    <Text style={styles.contactButtonText}>Contato</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.scheduleButton}
                    onPress={handleScheduleVisit}
                >
                    <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.scheduleButtonText}>Agendar Visita</Text>
                </TouchableOpacity>
            </View>
        </ScreenBackground>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    imageContainer: {
        position: 'relative',
        height: 300,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 10,
    },
    favoriteButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 10,
    },
    contentContainer: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        padding: 20,
        minHeight: 400,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        flex: 1,
        marginRight: 10,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    address: {
        marginLeft: 8,
        fontSize: 16,
        color: COLORS.gray,
    },
    featuresContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
        paddingVertical: 20,
        backgroundColor: COLORS.background,
        borderRadius: 15,
    },
    featureItem: {
        alignItems: 'center',
    },
    featureLabel: {
        fontSize: 12,
        color: COLORS.gray,
        marginTop: 5,
    },
    featureValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: 2,
    },
    descriptionContainer: {
        marginBottom: 30,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: COLORS.gray,
        lineHeight: 24,
    },
    additionalInfoContainer: {
        marginBottom: 100,
    },
    additionalInfoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 15,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoText: {
        marginLeft: 10,
        fontSize: 16,
        color: COLORS.text,
    },
    actionButtonsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        padding: 20,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.background,
    },
    contactButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        marginRight: 10,
    },
    contactButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    scheduleButton: {
        flex: 1,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    scheduleButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
});

import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Alert,
    Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import ScreenBackground from '../../components/common/ScreenBackground';
import { Property } from '../../interface/IProperty';
import styles from '../../components/Styles/PropertyDetailsStyle';

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
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

    const openImageModal = (image: string) => {
        setSelectedImage(image);
        setModalVisible(true);
    };

    const closeImageModal = () => {
        setModalVisible(false);
        setSelectedImage(null);
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

                    {property.image_Array && property.image_Array.length > 0 && (
                        <View style={{ marginTop: 16 }}>
                            <Text style={{ color: COLORS.gray, marginBottom: 8 }}>Galeria</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {property.image_Array.map((img, idx) => (
                                    <TouchableOpacity key={idx} onPress={() => openImageModal(img)}>
                                        <Image
                                            source={{ uri: img }}
                                            style={{ width: 100, height: 80, borderRadius: 8, marginRight: 8 }}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    <Modal visible={modalVisible} transparent onRequestClose={closeImageModal}>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={closeImageModal} style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
                                <Text style={{ color: '#fff', fontSize: 16 }}>Fechar</Text>
                            </TouchableOpacity>
                            {selectedImage && (
                                <Image source={{ uri: selectedImage }} style={{ width: '90%', height: '75%', resizeMode: 'contain' }} />
                            )}
                        </View>
                    </Modal>

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


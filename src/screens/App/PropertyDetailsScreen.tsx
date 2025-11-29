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
                    <Image
                        source={{ uri: property.image_url }}
                        style={styles.image}
                        accessibilityLabel={`Imagem principal do imóvel: ${property.title}`}
                    />
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        accessibilityRole="button"
                        accessibilityLabel="Voltar"
                        accessibilityHint="Toque para retornar à tela anterior"
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={handleFavoritePress}
                        accessibilityRole="button"
                        accessibilityLabel={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                        accessibilityHint="Toque para favoritar este imóvel"
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
                    <View style={styles.titleRow} accessibilityLabel={`Título: ${property.title}. Preço: $${property.price}`}>
                        <Text style={styles.title} accessibilityRole="header">{property.title}</Text>
                        <Text style={styles.price}>$ {property.price}</Text>
                    </View>

                    {/* Endereço */}
                    <View style={styles.addressRow} accessibilityLabel={`Endereço: ${property.address}`}>
                        <Ionicons name="location-outline" size={20} color={COLORS.gray} accessible={false} />
                        <Text style={styles.address}>{property.address}</Text>
                    </View>

                    {/* Características */}
                    <View style={styles.featuresContainer}>
                        <View style={styles.featureItem} accessibilityLabel={`${property.bedrooms} quartos`}>
                            <Ionicons name="bed-outline" size={24} color={COLORS.primary} accessible={false}/>
                            <Text style={styles.featureLabel}>Quartos</Text>
                            <Text style={styles.featureValue}>{property.bedrooms}</Text>
                        </View>
                        <View style={styles.featureItem} accessibilityLabel={`${property.bathrooms} banheiros`}>
                            <Ionicons name="water-outline" size={24} color={COLORS.primary} accessible={false}/>
                            <Text style={styles.featureLabel}>Banheiros</Text>
                            <Text style={styles.featureValue}>{property.bathrooms}</Text>
                        </View>
                        <View style={styles.featureItem} accessibilityLabel={`${property.garages} garagens`}>
                            <Ionicons name="car-sport-outline" size={24} color={COLORS.primary} accessible={false}/>
                            <Text style={styles.featureLabel}>Garagens</Text>
                            <Text style={styles.featureValue}>{property.garages}</Text>
                        </View>
                    </View>

                    {/* Descrição */}
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionTitle} accessibilityRole="header">Descrição</Text>
                        <Text style={styles.description}>{property.description}</Text>
                    </View>

                    {property.image_Array && property.image_Array.length > 0 && (
                        <View style={{ marginTop: 16 }}>
                            <Text style={{ color: COLORS.gray, marginBottom: 8 }} accessibilityRole="header">Galeria</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {property.image_Array.map((img, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        onPress={() => openImageModal(img)}
                                        accessibilityRole="button"
                                        accessibilityLabel={`Imagem ${idx + 1} da galeria`}
                                        accessibilityHint="Toque para ver em tela cheia"
                                    >
                                        <Image
                                            source={{ uri: img }}
                                            style={{ width: 100, height: 80, borderRadius: 8, marginRight: 8 }}
                                            accessibilityIgnoresInvertColors
                                        />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    <Modal visible={modalVisible} transparent onRequestClose={closeImageModal}>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={closeImageModal}
                                style={{ position: 'absolute', top: 40, right: 20, zIndex: 10 }}
                                accessibilityRole="button"
                                accessibilityLabel="Fechar"
                                accessibilityHint="Toque para fechar a visualização da imagem"
                            >
                                <Text style={{ color: '#fff', fontSize: 16 }}>Fechar</Text>
                            </TouchableOpacity>
                            {selectedImage && (
                                <Image
                                    source={{ uri: selectedImage }}
                                    style={{ width: '90%', height: '75%', resizeMode: 'contain' }}
                                    accessibilityLabel="Imagem em tela cheia"
                                />
                            )}
                        </View>
                    </Modal>

                    {/* Informações adicionais */}
                    <View style={styles.additionalInfoContainer}>
                        <Text style={styles.additionalInfoTitle} accessibilityRole="header">Informações Adicionais</Text>
                        <View style={styles.infoItem} accessibilityLabel="Mobiliado">
                            <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.primary} accessible={false}/>
                            <Text style={styles.infoText}>Mobiliado</Text>
                        </View>
                        <View style={styles.infoItem} accessibilityLabel="Wi-Fi incluído">
                            <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.primary} accessible={false}/>
                            <Text style={styles.infoText}>Wi-Fi incluído</Text>
                        </View>
                        <View style={styles.infoItem} accessibilityLabel="Área de lazer">
                            <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.primary} accessible={false}/>
                            <Text style={styles.infoText}>Área de lazer</Text>
                        </View>
                        <View style={styles.infoItem} accessibilityLabel="Segurança 24h">
                            <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.primary} accessible={false}/>
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
                    accessibilityRole="button"
                    accessibilityLabel="Contato"
                    accessibilityHint="Toque para ver as opções de contato"
                >
                    <Ionicons name="call-outline" size={20} color={COLORS.white} accessible={false}/>
                    <Text style={styles.contactButtonText}>Contato</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.scheduleButton}
                    onPress={handleScheduleVisit}
                    accessibilityRole="button"
                    accessibilityLabel="Agendar Visita"
                    accessibilityHint="Toque para agendar uma visita ao imóvel"
                >
                    <Ionicons name="calendar-outline" size={20} color={COLORS.primary} accessible={false}/>
                    <Text style={styles.scheduleButtonText}>Agendar Visita</Text>
                </TouchableOpacity>
            </View>
        </ScreenBackground>
    );
}

const { width } = Dimensions.get('window');


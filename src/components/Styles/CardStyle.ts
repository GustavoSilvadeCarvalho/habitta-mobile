import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const cardStyles = StyleSheet.create({
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
        color: COLORS.textGray,
    },
    pricePeriod: {
        marginLeft: 'auto',
        color: COLORS.textGray,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    addressText: {
        marginLeft: 5,
        color: COLORS.textGray,
    },
    description: {
        marginTop: 10,
        color: COLORS.text,
        fontSize: 12,
        lineHeight: 18,
    },
});
 
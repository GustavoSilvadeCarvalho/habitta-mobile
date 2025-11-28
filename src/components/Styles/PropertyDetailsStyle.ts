
import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const PropertyDetailsStyles = StyleSheet.create({
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
export default PropertyDetailsStyles;
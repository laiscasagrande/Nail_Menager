import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Pencil, Trash2 } from "lucide-react-native";
import { COLORS } from "../../../constants/colors";

export function ServiceCard({ item, onEdit, onDelete }) {
    return (
        <View style={styles.card}>
            <Image
                source={{ uri: item.image || 'https://via.placeholder.com/150' }}
                style={styles.cardImage}
            />

            <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.procedure}</Text>
                <View style={styles.dataLinha}>
                    <Text style={styles.price}>R$ {item.price}</Text>
                    <Text style={styles.dataTexto}>{item.duration}</Text>
                </View>
            </View>

            <View style={styles.cardButtons}>
                <TouchableOpacity onPress={() => onEdit(item)}>
                    <Pencil size={20} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(item)}>
                    <Trash2 size={20} color={COLORS.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    cardImage: {
        width: 70,
        height: 70,
        borderRadius: 14,
        backgroundColor: '#FCE4EC',
    },
    cardInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
    },
    dataLinha: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 6,
    },
    price: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
    },
    dataTexto: {
        fontSize: 12,
        color: '#888',
    },
    cardButtons: {
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 55,
    },
});
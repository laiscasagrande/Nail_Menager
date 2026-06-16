import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Pencil, Trash2 } from "lucide-react-native";
import { COLORS } from "../../../constants/colors";
import { useTheme } from '../../../context/ThemeContext';

export function ServiceCard({ item, onEdit, onDelete }) {
    const { theme } = useTheme();
    return (
        <View style={[styles.card, { backgroundColor: theme.card }]}> 
            <Image
                source={{ uri: item.image || 'https://via.placeholder.com/150' }}
                style={[styles.cardImage, { backgroundColor: theme.text === '#FFFFFF' ? '#2A2A2A' : '#FCE4EC' }]}
            />

            <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>{item.procedure}</Text>
                <View style={styles.dataLinha}>
                    <Text style={[styles.price, { color: theme.primary }]}>R$ {item.price}</Text>
                    <Text style={[styles.dataTexto, { color: theme.text }]}>{item.duration}h</Text>
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
        color: '#ff008c',
    },
    dataTexto: {
        fontSize: 12,
    },
    cardButtons: {
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 55,
    },
});
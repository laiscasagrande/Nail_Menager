import { Calendar, Timer } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../context/ThemeContext";

export default function DateCard({ date, title, onPressDate, onPressTime }) {
    const { theme } = useTheme();

    return (
        <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.card }]}> 
            <Text style={[styles.label, { color: theme.primary }]}> 
                {title}
            </Text>
            <View style={styles.row}>
                <Text style={{ color: theme.text }}>
                    {date.toLocaleDateString(
                        "pt-BR",
                        {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        }
                    )}
                </Text>
                <Calendar
                    color={theme.primary}
                    onPress={onPressDate}
                />
            </View>
            <View style={styles.row}>
                <Text style={{ color: theme.text }}>
                    {date.toLocaleTimeString(
                        "pt-BR",
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                        }
                    )}
                </Text>
                <Timer
                    color={theme.primary}
                    onPress={onPressTime}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    card: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        gap: 15,
    },

    label: {
        fontSize: 15,
        fontWeight: "600",
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
});

import { Calendar, Timer } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../../../constants/colors";

export default function DateCard({ date, title, setShowDate, setShowTime }) {
    return (
        <View style={styles.card}>
            <Text style={styles.label}>
                {title}
            </Text>
            <View style={styles.row}>
                <Text>
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
                    color={COLORS.primary}
                    onPress={() =>
                        setShowDate(true)
                    }
                />
            </View>
            <View style={styles.row}>
                <Text>
                    {date.toLocaleTimeString(
                        "pt-BR",
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                        }
                    )}
                </Text>
                <Timer
                    color={COLORS.primary}
                    onPress={() =>
                        setShowTime(true)
                    }
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    card: {
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 10,
        padding: 15,
        gap: 15,
    },

    label: {
        fontSize: 15,
        color: COLORS.primary,
        fontWeight: "600",
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
});

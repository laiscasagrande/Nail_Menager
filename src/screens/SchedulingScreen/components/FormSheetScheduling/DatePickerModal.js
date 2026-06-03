import 'react-native-get-random-values';
import { useFormContext } from "react-hook-form";
import { Modal, Platform, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { COLORS } from "../../../../constants/colors";

export default function DatePickerModal({
    visible,
    setVisible,
    title,
    mode,
    name,
}) {
    const { watch, setValue } = useFormContext();

    const value = watch(name) || new Date();

    function handleDateChange(event, selectedDate) {
        if (!selectedDate) {
            setVisible(false);
            return;
        }

        const updated = new Date(value);

        if (mode === "date") {
            updated.setFullYear(selectedDate.getFullYear());
            updated.setMonth(selectedDate.getMonth());
            updated.setDate(selectedDate.getDate());
        } else {
            updated.setHours(selectedDate.getHours());
            updated.setMinutes(selectedDate.getMinutes());
        }

        setValue(name, updated);

        if (Platform.OS === "android") {
            setVisible(false);
        }
    }

    if (!visible) {
        return null;
    }

    // ANDROID
    if (Platform.OS === "android") {
        return (
            <DateTimePicker
                value={value}
                mode={mode}
                display="default"
                onChange={handleDateChange}
            />
        );
    }

    // IOS
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={() => setVisible(false)}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                        {title}
                    </Text>

                    <DateTimePicker
                        value={value}
                        mode={mode}
                        locale="pt-BR"
                        display={mode === "date" ? "inline" : "spinner"}
                        onChange={handleDateChange}
                    />

                    <Button
                        mode="contained"
                        buttonColor={COLORS.primary}
                        onPress={() => setVisible(false)}
                    >
                        Confirmar
                    </Button>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    modalContent: {
        backgroundColor: COLORS.white,
        width: "100%",
        borderRadius: 20,
        padding: 20,
        gap: 20,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.primary,
    },
});
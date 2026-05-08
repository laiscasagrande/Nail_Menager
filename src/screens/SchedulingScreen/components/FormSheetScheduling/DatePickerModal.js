import { Controller } from "react-hook-form";
import { Modal, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { COLORS } from "../../../../constants/colors";

export default function DatePickerModal({ showDate, setShowDate, title, control, date, setDate, mode, name }) {
    return (
        <Modal
            visible={showDate}
            transparent
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                        {title}
                    </Text>
                    {mode === "date" ?
                        <Controller
                            control={control}
                            name={name}
                            render={({ field: { onChange, onBlur, value }, fieldState }) => (
                                <DateTimePicker
                                    value={value}
                                    mode={mode}
                                    display="inline"
                                    locale="pt-BR"
                                    onChange={(event, selectedDate) => {

                                        if (selectedDate) {

                                            const updated =
                                                new Date(date);

                                            updated.setFullYear(
                                                selectedDate.getFullYear()
                                            );

                                            updated.setMonth(
                                                selectedDate.getMonth()
                                            );

                                            updated.setDate(
                                                selectedDate.getDate()
                                            );

                                            onChange(updated);

                                            setDate(updated);
                                        }
                                    }}
                                />
                            )}
                        />
                        :
                        <Controller
                            control={control}
                            name={name}
                            render={({ field: { onChange, onBlur, value }, fieldState }) => (
                                <DateTimePicker
                                    value={value}
                                    mode={mode}
                                    display="spinner"
                                    locale="pt-BR"
                                    onChange={(event, selectedDate) => {

                                        if (selectedDate) {

                                            const updated =
                                                new Date(date);

                                            updated.setHours(
                                                selectedDate.getHours()
                                            );

                                            updated.setMinutes(
                                                selectedDate.getMinutes()
                                            );

                                            onChange(updated);

                                            setDate(updated);
                                        }
                                    }}
                                />
                            )}
                        />
                    }
                    <Button
                        mode="contained"
                        buttonColor={COLORS.primary}
                        onPress={() =>
                            setShowDate(false)
                        }
                    >
                        Confirmar
                    </Button>
                </View>
            </View>
        </Modal>
    )
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
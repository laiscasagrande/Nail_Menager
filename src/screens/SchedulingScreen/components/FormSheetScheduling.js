import { Modal, StyleSheet, Text, View } from "react-native";
import FormSheet from "../../../components/FormSheet";
import { Controller } from "react-hook-form";
import { Button, TextInput } from "react-native-paper";
import { Calendar, Timer } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { COLORS } from "../../../constants/colors";

export default function FormSheetScheduling({ setDateStart, dateStart, setDateEnd, dateEnd, bottomSheetRef, methods, onSubmit }) {

    const [showDateStart, setShowDateStart] = useState(false);
    const [showDateEnd, setShowDateEnd] = useState(false);
    const [showTimeStart, setShowTimeStart] = useState(false);
    const [showTimeEnd, setShowTimeEnd] = useState(false);
    const { control, handleSubmit} = methods

    return (
        <>
            <FormSheet ref={bottomSheetRef}>
                <View style={styles.container}>
                    <View style={styles.form}>
                        <Controller
                            control={control}
                            name="event"
                            render={({ field: { onChange, onBlur, value }, fieldState }) => (
                                <TextInput
                                    label="Novo evento"
                                    mode="outlined"
                                    value={value}
                                    onChangeText={onChange}
                                    activeOutlineColor={COLORS.primary}
                                    outlineColor={COLORS.gray}
                                    error={!!fieldState.error}
                                />
                            )}
                        />
                        <View style={styles.dates}>
                            <View style={styles.card}>
                                <Text style={styles.label}>
                                    Início
                                </Text>
                                <View style={styles.row}>
                                    <Text>
                                        {dateStart.toLocaleDateString(
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
                                            setShowDateStart(true)
                                        }
                                    />
                                </View>
                                <View style={styles.row}>
                                    <Text>
                                        {dateStart.toLocaleTimeString(
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
                                            setShowTimeStart(true)
                                        }
                                    />
                                </View>
                            </View>
                            <View style={styles.card}>
                                <Text style={styles.label}>
                                    Fim
                                </Text>
                                <View style={styles.row}>
                                    <Text>
                                        {dateEnd.toLocaleDateString(
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
                                            setShowDateEnd(true)
                                        }
                                    />
                                </View>
                                <View style={styles.row}>
                                    <Text>
                                        {dateEnd.toLocaleTimeString(
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
                                            setShowTimeEnd(true)
                                        }
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.containerButton}>
                        <Button style={styles.button} onPress={handleSubmit(onSubmit)}>
                            <Text style={styles.buttonText}>
                                Salvar
                            </Text>
                        </Button>
                    </View>
                </View>
            </FormSheet>
            <Modal
                visible={showDateStart}
                transparent
                animationType="fade"
            >
                <View style={styles.overlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Selecione a data inicial
                        </Text>
                        <Controller
                            control={control}
                            name="dateStart"
                            render={({ field: { onChange, onBlur, value }, fieldState }) => (
                                <DateTimePicker
                                    value={value}
                                    mode="date"
                                    display="inline"
                                    locale="pt-BR"
                                    onChange={(event, selectedDate) => {

                                        if (selectedDate) {

                                            const updated =
                                                new Date(dateStart);

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

                                            setDateStart(updated);
                                        }
                                    }}
                                />
                            )}
                        />
                        <Button
                            mode="contained"
                            buttonColor={COLORS.primary}
                            onPress={() =>
                                setShowDateStart(false)
                            }
                        >
                            Confirmar
                        </Button>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showTimeStart}
                transparent
                animationType="fade"
            >
                <View style={styles.overlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Selecione o horário inicial
                        </Text>
                        <Controller
                            control={control}
                            name="dateStart"
                            render={({ field: { onChange, onBlur, value }, fieldState }) => (
                                <DateTimePicker
                                    value={value}
                                    mode="time"
                                    display="spinner"
                                    locale="pt-BR"
                                    onChange={(event, selectedDate) => {

                                        if (selectedDate) {

                                            const updated =
                                                new Date(dateStart);

                                            updated.setHours(
                                                selectedDate.getHours()
                                            );

                                            updated.setMinutes(
                                                selectedDate.getMinutes()
                                            );

                                            onChange(updated);

                                            setDateStart(updated);
                                        }
                                    }}
                                />
                            )}
                        />
                        <Button
                            mode="contained"
                            buttonColor={COLORS.primary}
                            onPress={() =>
                                setShowTimeStart(false)
                            }
                        >
                            Confirmar
                        </Button>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showDateEnd}
                transparent
                animationType="fade"
            >
                <View style={styles.overlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Selecione a data final
                        </Text>
                        <Controller
                            control={control}
                            name="dateEnd"
                            render={({ field: { onChange, onBlur, value }, fieldState }) => (
                                <DateTimePicker
                                    value={value}
                                    mode="date"
                                    display="inline"
                                    locale="pt-BR"
                                    onChange={(event, selectedDate) => {

                                        if (selectedDate) {

                                            const updated =
                                                new Date(dateEnd);

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

                                            setDateEnd(updated);
                                        }
                                    }}
                                />
                            )}
                        />
                        <Button
                            mode="contained"
                            buttonColor={COLORS.primary}
                            onPress={() =>
                                setShowDateEnd(false)
                            }
                        >
                            Confirmar
                        </Button>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showTimeEnd}
                transparent
                animationType="fade"
            >
                <View style={styles.overlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Selecione o horário final
                        </Text>
                        <Controller
                            control={control}
                            name="dateEnd"
                            render={({ field: { onChange, onBlur, value }, fieldState }) => (
                                <DateTimePicker
                                    value={value}
                                    mode="time"
                                    display="spinner"
                                    locale="pt-BR"
                                    onChange={(event, selectedDate) => {

                                        if (selectedDate) {

                                            const updated =
                                                new Date(dateEnd);

                                            updated.setHours(
                                                selectedDate.getHours()
                                            );

                                            updated.setMinutes(
                                                selectedDate.getMinutes()
                                            );

                                            onChange(updated);

                                            setDateEnd(updated);
                                        }
                                    }}
                                />
                            )}
                        />
                        <Button
                            mode="contained"
                            buttonColor={COLORS.primary}
                            onPress={() =>
                                setShowTimeEnd(false)
                            }
                        >
                            Confirmar
                        </Button>
                    </View>
                </View>
            </Modal>
        </>

    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "space-between",
    },

    form: {
        gap: 30,
    },

    dates: {
        flexDirection: "column",
        gap: 20,
    },

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

    button: {
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        width: 282,
        height: 58,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },

    buttonText: {
        fontSize: 18,
        color: COLORS.white,
    },

    containerButton: {
        alignItems: "center",
    },

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
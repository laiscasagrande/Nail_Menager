import { StyleSheet, Text, View } from "react-native";
import FormSheet from "../../../../components/FormSheet";
import { Controller } from "react-hook-form";
import { Button, TextInput } from "react-native-paper";
import { Calendar, Timer } from "lucide-react-native";
import { useState } from "react";
import { COLORS } from "../../../../constants/colors";
import DatePickerModal from "./DatePickerModal";
import DateCard from "./DateCard";

export default function FormSheetScheduling({ setDateStart, dateStart, setDateEnd, dateEnd, bottomSheetRef, methods, onSubmit }) {

    const [showDateStart, setShowDateStart] = useState(false);
    const [showDateEnd, setShowDateEnd] = useState(false);
    const [showTimeStart, setShowTimeStart] = useState(false);
    const [showTimeEnd, setShowTimeEnd] = useState(false);
    const { handleSubmit, control } = methods

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
                            <DateCard
                                date={dateStart}
                                title={"Início"}
                                setShowDate={setShowDateStart}
                                setShowTime={setShowTimeStart}
                            />
                            <DateCard
                                date={dateEnd}
                                title={"Fim"}
                                setShowDate={setShowDateEnd}
                                setShowTime={setShowTimeEnd}
                            />
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

            <DatePickerModal
                showDate={showDateStart}
                setShowDate={setShowDateStart}
                title={"Selecione a data inicial"}
                control={methods.control}
                setDate={setDateStart}
                date={dateStart}
                mode={"date"}
                name={"dateStart"}
            />

            <DatePickerModal
                showDate={showTimeStart}
                setShowDate={setShowTimeStart}
                title={"Selecione o horário inicial"}
                control={methods.control}
                setDate={setDateStart}
                date={dateStart}
                mode={"time"}
                name={"dateStart"}
            />

            <DatePickerModal
                showDate={showDateEnd}
                setShowDate={setShowDateEnd}
                title={"Selecione a data final"}
                control={methods.control}
                setDate={setDateEnd}
                date={dateEnd}
                mode={"date"}
                name={"dateEnd"}
            />

            <DatePickerModal
                showDate={showTimeEnd}
                setShowDate={setShowTimeEnd}
                title={"Selecione o horário final"}
                control={methods.control}
                setDate={setDateEnd}
                date={dateEnd}
                mode={"time"}
                name={"dateEnd"}
            />
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
    }
});
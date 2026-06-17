import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import FormSheet from "../../../../components/FormSheet";
import { Controller, useFormContext } from "react-hook-form";
import { Button, Menu, TextInput } from "react-native-paper";
import { useState } from "react";
import { COLORS } from "../../../../constants/colors";
import DatePickerModal from "./DatePickerModal";
import DateCard from "./DateCard";
import { useTheme } from "../../../../context/ThemeContext";

export default function FormSheetScheduling({ bottomSheetRef, onSubmit, onCancel, onCompleted, isEditing, onReactivate, onEdit, services, customers }) {

    const [modal, setModal] = useState({
        visible: false,
        name: "",
        mode: "date",
        title: "",
    });
    const { handleSubmit, control, watch, formState: { errors } } = useFormContext()
    const dateStart = watch("dateStart");
    const dateEnd = watch("dateEnd");
    const [visibleMenu, setVisibleMenu] = useState(false);
    const [visibleService, setVisibleService] = useState(false);
    const eventValue = watch("event");
    const status = watch("status");
    const statusIsOverdue = status === "scheduled" && new Date(dateEnd) < new Date();
    const { theme } = useTheme();

    function callFunctionCreateOrEdit() {
        if (isEditing) {
            handleSubmit(onEdit)();
        } else {
            handleSubmit(onSubmit)();
        }
    }

    return (
        <>
            <FormSheet ref={bottomSheetRef}>
                <View style={styles.container}>
                    <View style={styles.form}>
                        <View style={styles.selects}>
                            <Controller
                                control={control}
                                name="client"
                                render={({ field: { onChange, value } }) => {
                                    const selectedLabel =
                                        customers.find((item) => item.id === value)?.name || "";

                                    return (
                                        <Menu
                                            visible={visibleMenu}
                                            onDismiss={() => setVisibleMenu(false)}
                                            anchor={
                                                <TextInput
                                                    label="Clientes"
                                                    value={selectedLabel}
                                                    mode="outlined"
                                                    editable={false}
                                                    error={!!errors.client}
                                                    right={
                                                        <TextInput.Icon
                                                            icon="menu-down"
                                                            onPress={() => setVisibleMenu(true)}
                                                        />
                                                    }
                                                    onPressIn={() => setVisibleMenu(true)}
                                                    outlineColor={theme.border}
                                                    activeOutlineColor={theme.primary}
                                                    theme={{ colors: { text: theme.text, placeholder: theme.primary, primary: theme.primary, background: theme.card, onSurfaceVariant: theme.primary, onSurface: theme.text } }}
                                                    style={{ color: theme.text, backgroundColor: theme.card }}
                                                    selectionColor={theme.primary}
                                                    textColor={theme.text}
                                                />
                                            }
                                        >
                                            {customers.map((item) => (
                                                <Menu.Item
                                                    key={item.id}
                                                    title={item.name}
                                                    onPress={() => {
                                                        onChange(item.id);
                                                        setVisibleMenu(false);
                                                    }}
                                                />
                                            ))}
                                        </Menu>
                                    );
                                }}
                            />
                            <Controller
                                control={control}
                                name="service"
                                render={({ field: { onChange, value } }) => {
                                    const selectedLabel =
                                        services.find((item) => item.id === value)?.procedure || "";

                                    return (
                                        <Menu
                                            visible={visibleService}
                                            onDismiss={() => setVisibleService(false)}
                                            anchor={
                                                <TextInput
                                                    label="Serviços"
                                                    value={selectedLabel}
                                                    mode="outlined"
                                                    error={!!errors.service}
                                                    editable={false}
                                                    right={
                                                        <TextInput.Icon
                                                            icon="menu-down"
                                                            onPress={() => setVisibleService(true)}
                                                        />
                                                    }
                                                    onPressIn={() => setVisibleService(true)}
                                                    outlineColor={theme.border}
                                                    activeOutlineColor={theme.primary}
                                                    theme={{ colors: { text: theme.text, placeholder: theme.primary, primary: theme.primary, background: theme.card, onSurfaceVariant: theme.primary, onSurface: theme.text } }}
                                                    style={{ color: theme.text, backgroundColor: theme.card }}
                                                    selectionColor={theme.primary}
                                                    textColor={theme.text}
                                                />
                                            }
                                        >
                                            {services.map((item) => (
                                                <Menu.Item
                                                    key={item.id}
                                                    title={item.procedure}
                                                    onPress={() => {
                                                        onChange(item.id);
                                                        setVisibleService(false);
                                                    }}
                                                />
                                            ))}
                                        </Menu>
                                    );
                                }}
                            />
                        </View>
                        <View style={styles.dates}>
                            <DateCard
                                date={dateStart}
                                title={"Início"}
                                onPressDate={() =>
                                    setModal({
                                        visible: true,
                                        name: "dateStart",
                                        mode: "date",
                                        title: "Selecione a data inicial"
                                    })
                                }
                                onPressTime={() =>
                                    setModal({
                                        visible: true,
                                        name: "dateStart",
                                        mode: "time",
                                        title: "Selecione o horário inicial",
                                    })
                                }
                            />
                            <DateCard
                                date={dateEnd}
                                title={"Fim"}
                                onPressDate={() =>
                                    setModal({
                                        visible: true,
                                        name: "dateEnd",
                                        mode: "date",
                                        title: "Selecione a data final"
                                    })
                                }
                                onPressTime={() =>
                                    setModal({
                                        visible: true,
                                        name: "dateEnd",
                                        mode: "time",
                                        title: "Selecione o horário final",
                                    })
                                }
                            />
                        </View>
                    </View>
                    <View>
                        {statusIsOverdue ?
                            <View style={{ width: '100%', height: 65, marginBottom: 15, flexDirection: "row", gap: 10 }}>
                                <TouchableOpacity style={styles.buttonCompleted} onPress={handleSubmit(onCompleted)}>
                                    <Text style={styles.buttonText}>
                                        Concluir
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            : status === "scheduled" ? (
                                <View style={{ width: '100%', height: 65, marginBottom: 15, flexDirection: "row", gap: 10 }}>
                                    <TouchableOpacity style={styles.buttonSave} onPress={callFunctionCreateOrEdit}>
                                        <Text style={styles.buttonText}>
                                            Salvar
                                        </Text>
                                    </TouchableOpacity>
                                    {isEditing && (
                                        <TouchableOpacity style={styles.buttonCancel} onPress={handleSubmit(onCancel)}>
                                            <Text style={styles.buttonText}>
                                                Cancelar horário
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ) : status === "cancelled" ? (
                                <View style={{ width: '100%', height: 65, marginBottom: 15, flexDirection: "row", gap: 10 }}>
                                    <TouchableOpacity style={styles.buttonSave} onPress={callFunctionCreateOrEdit}>
                                        <Text style={styles.buttonText}>
                                            Salvar
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonCancel} onPress={handleSubmit(onReactivate)}>
                                        <Text style={styles.buttonText}>
                                            Reativar
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : null}
                    </View>
                </View>
            </FormSheet>

            <DatePickerModal
                visible={modal.visible}
                setVisible={(value) =>
                    setModal((prev) => ({
                        ...prev,
                        visible: value,
                    }))
                }
                title={modal.title}
                mode={modal.mode}
                name={modal.name}
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
        gap: 10,
    },

    selects: {
        gap: 4
    },

    dates: {
        flexDirection: "column",
        gap: 10,
    },

    buttonSave: {
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
        marginBottom: 15,
    },

    buttonCancel: {
        borderRadius: 10,
        backgroundColor: COLORS.gray,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },

    buttonCompleted: {
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },

    buttonText: {
        fontSize: 18,
        color: COLORS.white,
    }
});
import { StyleSheet, Text, View } from "react-native";
import FormSheet from "../../../../components/FormSheet";
import { Controller, useFormContext } from "react-hook-form";
import { Button, Menu, TextInput } from "react-native-paper";
import { useState } from "react";
import { COLORS } from "../../../../constants/colors";
import DatePickerModal from "./DatePickerModal";
import DateCard from "./DateCard";

export const CLIENTS = [
    { label: "Laís Kaminski Casagrande", value: "1" },
    { label: "João Silva", value: "2" },
    { label: "Maria Souza", value: "3" },
];

export const SERVICES = [
    { label: "Manicure Tradicional", value: "1" },
    { label: "Alongamento em Gel", value: "2" },
    { label: "Banho de Gel", value: "3" },
];

export default function FormSheetScheduling({ bottomSheetRef, onSubmit, onCancel, onCompleted, isEditing, onReactivate, onEdit }) {

    const [modal, setModal] = useState({
        visible: false,
        name: "",
        mode: "date",
        title: "",
    });
    const { handleSubmit, control, watch } = useFormContext()
    const dateStart = watch("dateStart");
    const dateEnd = watch("dateEnd");
    const [visibleMenu, setVisibleMenu] = useState(false);
    const [visibleService, setVisibleService] = useState(false);
    const eventValue = watch("event");
    const status = watch("status");
    const statusIsOverdue = status === "scheduled" && new Date(dateEnd) < new Date();
    const selectedLabel = CLIENTS.find((item) => String(item.value) === String(eventValue))?.label || "";

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
                                        CLIENTS.find((item) => item.value === value)?.label || "";

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
                                                    right={
                                                        <TextInput.Icon
                                                            icon="menu-down"
                                                            onPress={() => setVisibleMenu(true)}
                                                        />
                                                    }
                                                    onPressIn={() => setVisibleMenu(true)}
                                                />
                                            }
                                        >
                                            {CLIENTS.map((item) => (
                                                <Menu.Item
                                                    key={item.value}
                                                    title={item.label}
                                                    onPress={() => {
                                                        onChange(item.value);
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
                                        SERVICES.find((item) => item.value === value)?.label || "";

                                    return (
                                        <Menu
                                            visible={visibleService}
                                            onDismiss={() => setVisibleService(false)}
                                            anchor={
                                                <TextInput
                                                    label="Serviços"
                                                    value={selectedLabel}
                                                    mode="outlined"
                                                    editable={false}
                                                    right={
                                                        <TextInput.Icon
                                                            icon="menu-down"
                                                            onPress={() => setVisibleService(true)}
                                                        />
                                                    }
                                                    onPressIn={() => setVisibleService(true)}
                                                />
                                            }
                                        >
                                            {SERVICES.map((item) => (
                                                <Menu.Item
                                                    key={item.value}
                                                    title={item.label}
                                                    onPress={() => {
                                                        onChange(item.value);
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
                    <View style={styles.containerButton}>
                        {statusIsOverdue ?
                            <Button style={styles.buttonCompleted} onPress={handleSubmit(onCompleted)}>
                                <Text style={styles.buttonText}>
                                    Concluir
                                </Text>
                            </Button>
                            : status === "scheduled" ? (
                                <>
                                    <Button style={styles.buttonSave} onPress={callFunctionCreateOrEdit}>
                                        <Text style={styles.buttonText}>
                                            Salvar
                                        </Text>
                                    </Button>
                                    {isEditing && (
                                        <Button style={styles.buttonCancel} onPress={handleSubmit(onCancel)}>
                                            <Text style={styles.buttonText}>
                                                Cancelar
                                            </Text>
                                        </Button>
                                    )}
                                </>
                            ) : status === "cancelled" ? (
                                <>
                                    <Button style={styles.buttonSave} onPress={callFunctionCreateOrEdit}>
                                        <Text style={styles.buttonText}>
                                            Salvar
                                        </Text>
                                    </Button>
                                    <Button style={styles.buttonCancel} onPress={onReactivate}>
                                        <Text style={styles.buttonText}>
                                            Reativar
                                        </Text>
                                    </Button>
                                </>
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
        width: 150,
        height: 58,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },

    buttonCancel: {
        borderRadius: 10,
        backgroundColor: COLORS.gray,
        width: 150,
        height: 58,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },

    buttonCompleted: {
        borderRadius: 10,
        backgroundColor: COLORS.gray,
        width: 150,
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
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
    }
});
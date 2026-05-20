import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { TextInput } from "react-native-paper";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { COLORS } from "../constants/colors";

export default function ClientScreen() {
    const [clients, setClients] = useState([]);
    const [name, setName] = useState("");
    const [telefone, setTelefone] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        seekClients();
    }, []);

    async function seekClients() {
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, "clients"));
            const clientList = snapshot.docs.map((docSnapshot) => ({
                id: docSnapshot.id,
                ...docSnapshot.data(),
            }));
            setClients(clientList);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível carregar os clientes.");
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setName("");
        setTelefone("");
        setEditingId(null);
    }

    async function handleSave() {
        const payload = {
            name: name.trim(),
            telefone: telefone.trim(),
        };

        if (!payload.name) {
            Alert.alert("Atenção", "Informe o nome do cliente.");
            return;
        }

        try {
            if (editingId) {
                await updateDoc(doc(db, "clients", editingId), payload);
                setClients((prev) =>
                    prev.map((client) =>
                        client.id === editingId ? { ...client, ...payload } : client
                    )
                );
            } else {
                const docRef = await addDoc(collection(db, "clients"), payload);
                setClients((prev) => [{ id: docRef.id, ...payload }, ...prev]);
            }

            resetForm();
        } catch (error) {
            Alert.alert(
                "Erro",
                editingId
                    ? "Não foi possível atualizar o cliente."
                    : "Não foi possível cadastrar o cliente."
            );
        }
    }

    function handleEdit(client) {
        setEditingId(client.id);
        setName(client.name || "");
        setTelefone(client.telefone || "");
    }

    function confirmDelete(client) {
        Alert.alert(
            "Excluir cliente",
            `Remover ${client.name || "este cliente"}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: () => deleteClient(client.id),
                },
            ]
        );
    }

    async function deleteClient(id) {
        try {
            await deleteDoc(doc(db, "clients", id));
            setClients((lastClients) => lastClients.filter((client) => client.id !== id));
        } catch (error) {
            Alert.alert("Erro", "Não foi possível deletar o cliente.");
        }
    }

    function renderItem({ item }) {
        return (
            <View style={styles.clientItem}>
                <View style={styles.clientInfo}>
                    <Text style={styles.clientName}>{item.name || "Sem nome"}</Text>
                    <Text style={styles.clientPhone}>{item.telefone || "Sem telefone"}</Text>
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.buttonEdit}
                        onPress={() => handleEdit(item)}
                    >
                        <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonDelete}
                        onPress={() => confirmDelete(item)}
                    >
                        <Text style={styles.buttonText}>Excluir</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Clientes</Text>
                <TextInput
                    label="Nome"
                    value={name}
                    mode="outlined"
                    onChangeText={setName}
                    style={styles.input}
                />
                <TextInput
                    label="Telefone"
                    value={telefone}
                    mode="outlined"
                    onChangeText={setTelefone}
                    keyboardType="phone-pad"
                    style={styles.input}
                />
                <View style={styles.formActions}>
                    <TouchableOpacity style={styles.buttonPrimary} onPress={handleSave}>
                        <Text style={styles.buttonText}>
                            {editingId ? "Atualizar" : "Salvar"}
                        </Text>
                    </TouchableOpacity>
                    {editingId ? (
                        <TouchableOpacity style={styles.buttonSecondary} onPress={resetForm}>
                            <Text style={styles.buttonTextSecondary}>Cancelar</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
            <FlatList
                data={clients}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    !loading ? (
                        <Text style={styles.emptyText}>Nenhum cliente cadastrado.</Text>
                    ) : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 12,
    },
    form: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#222",
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.white,
        marginBottom: 8,
    },
    formActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 4,
    },
    buttonPrimary: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    buttonSecondary: {
        borderWidth: 1,
        borderColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: "600",
    },
    buttonTextSecondary: {
        color: COLORS.primary,
        fontWeight: "600",
    },
    listContent: {
        gap: 10,
        paddingBottom: 16,
    },
    clientItem: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 12,
    },
    clientInfo: {
        gap: 4,
    },
    clientName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#222",
    },
    clientPhone: {
        fontSize: 12,
        color: "#666",
    },
    actions: {
        flexDirection: "row",
        gap: 8,
        marginTop: 8,
    },
    buttonEdit: {
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    buttonDelete: {
        backgroundColor: COLORS.red,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    emptyText: {
        textAlign: "center",
        color: "#888",
        marginTop: 12,
    },
});
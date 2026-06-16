import React, { useRef, useState, useEffect, useContext } from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
} from 'react-native';

import {
    Feather,
    MaterialIcons,
    Ionicons,
} from '@expo/vector-icons';

import { TextInput } from 'react-native-paper';

import ActionButtonAdd from '../components/ActionButtonAdd';
import FormSheet from '../components/FormSheet';

import { COLORS } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formCustomer } from '../schemas/customerSchema';
import {
    addDoc,
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    getDoc,
    where,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { AuthContext } from '../context/AuthContext';

export default function ClientsScreen() {

    const { theme, selectedTheme } = useTheme();

    const [clienteAberto, setClienteAberto] = useState(null);
    const [sheetIndex, setSheetIndex] = useState(0);
    const [customers, setCustomers] = useState([]);
    const [sheetOpen, setSheetOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [idClient, setIdClient] = useState("")
    const { user } = useContext(AuthContext);

    const methods = useForm({
        resolver: zodResolver(formCustomer),
        defaultValues: {
            id: "",
            name: "",
            telephone: "",
            observation: "",
        }
    });

    const bottomSheetRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            bottomSheetRef.current?.snapToIndex(0);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    function toggleCliente(id) {
        setClienteAberto(clienteAberto === id ? null : id);
    }

    function abrirSheet() {
        methods.reset({
            id: "",
            name: "",
            telephone: "",
            observation: "",
        });

        bottomSheetRef.current?.snapToIndex(1);
    }

    function fecharSheet() {
        bottomSheetRef.current?.snapToIndex(0);
    }

async function handleSaveClient(data) {
    if (!user?.uid) {
        Alert.alert("Erro", "Usuário não autenticado");
        return;
    }

    const telefoneLimpo = (data.telephone || '').replace(/\D/g, '');

    if (telefoneLimpo.length !== 11) {
        Alert.alert(
            "Telefone inválido",
            "Preencha um telefone válido."
        );
        return;
    }
    try {
            await addDoc(collection(db, "customers"), {
                uid: user.uid,
                name: data.name,
                telephone: data.telephone,
                observation: data.observation,
            });

            methods.reset({
                id: "",
                name: "",
                telephone: "",
                observation: "",
            });

            await getCustomers();

            setSheetOpen(false)
            bottomSheetRef.current?.close();

        } catch (error) {
            console.log(error);
        }
    }

    async function getCustomers() {
        if (!user?.uid) return;

        try {
            const q = query(collection(db, "customers"), where("uid", "==", user.uid));
            const customers = await getDocs(q);

            const data = customers.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setCustomers(data);

        } catch (error) {
            console.log(error);
        }
    }

    function handleEdit(client){
        console.log("llalalal", client)
        setIdClient(client.id)
        setIsEditing(true)
        methods.reset({
            name: client.name,
            observation: client.observation,
            telephone: client.telephone
        })
        bottomSheetRef.current?.expand()
    }

async function handleEditClient(data) {

    const customerRef = doc(db, "customers", idClient);

    try {
        const customerSnap = await getDoc(customerRef);

        if (!customerSnap.exists()) return;

        if(customerSnap.data().uid !==user.uid) {
            console.log("Sem permissão");
            return;
        }

        const telefoneLimpo = (data.telephone || '').replace(/\D/g, '');

        if (telefoneLimpo.length !== 11) {
            Alert.alert(
            "Telefone inválido",
            "Preencha um telefone válido."
        );
        return;
    }

            await updateDoc(customerRef, {
                name: data.name,
                telephone: data.telephone,
                observation: data.observation,
            });

            await getCustomers();

            methods.reset({
                id: "",
                name: "",
                telephone: "",
                observation: "",
            });

            setIsEditing(false);
            setSheetOpen(false);

            bottomSheetRef.current?.close();

        } catch (error) {
            console.log("Erro ao editar cliente:", error);
        }
    }

    async function deleteClient(id) {
        try {
            await deleteDoc(doc(db, 'customers', id));
            setCustomers((prev) => prev.filter((client) => client.id !== id));
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível deletar o cliente.');
        }
    }



    useEffect(() => {
        getCustomers();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <FlatList
                data={customers}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                    paddingTop: 10,
                    paddingBottom: 140,
                }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (

                    <View style={[styles.card, { backgroundColor: theme.card, borderWidth: selectedTheme === 'light' ? 1 : 0, borderColor: theme.border }]}> 

                        <View style={[styles.avatar, { backgroundColor: selectedTheme === 'dark' ? theme.primary : '#ffd8ea' }]}> 
                            <Text style={[styles.avatarText, { color: selectedTheme === 'dark' ? theme.card : '#d96a9c' }] }>
                                {item.name
                                    ?.split(' ')
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join('')
                                }
                            </Text>
                        </View>

                        <View style={styles.info}>
                            <Text style={[styles.nome, { color: theme.text }]}>
                                {item.name}
                            </Text>

                            <Text style={[styles.telefone, { color: theme.subtitle }]}>
                                {item.telephone}
                            </Text>

                            {clienteAberto === item.id && item.observation && (
                                <Text style={[styles.alergia, { color: theme.subtitle }]}>
                                    {item.observation}
                                </Text>
                            )}
                        </View>

                        <View style={styles.actions}>

                            <TouchableOpacity>
                                    <Feather
                                        name="edit-2"
                                        size={20}
                                        color={theme.primary}
                                        onPress={() => handleEdit(item)}
                                    />
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <MaterialIcons
                                    name="delete-outline"
                                    size={24}
                                    color={theme.primary}
                                    onPress={() => deleteClient(item.id)}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => toggleCliente(item.id)}
                            >
                                <Ionicons
                                    name={
                                        clienteAberto === item.id
                                            ? 'eye-off-outline'
                                            : 'eye-outline'
                                    }
                                    size={22}
                                    color={theme.subtitle}
                                />
                            </TouchableOpacity>

                        </View>

                    </View>

                )}
            />

            {!sheetOpen && (
    <View style={styles.fabContainer}>
        <ActionButtonAdd
            onPress={() => bottomSheetRef.current?.expand()}
        />
    </View>
)}

            <FormSheet
                ref={bottomSheetRef}
                onChange={(index) => setSheetOpen(index >= 0)}
            >

                <View style={[styles.container, { backgroundColor: theme.card }]}> 

                    <View style={styles.form}>

                        <Text style={[styles.formTitle, { color: theme.primary }] }>
                            Cadastrar novo cliente
                        </Text>

                        <Controller
                            control={methods.control}
                            name="name"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    label="Nome"
                                    value={value}
                                    onChangeText={onChange}
                                    mode="outlined"
                                    left={
                                        <TextInput.Icon icon="account-outline" />
                                    }
                                    outlineColor={theme.border}
                                    activeOutlineColor={theme.primary}
                                    theme={{ colors: { text: theme.text, placeholder: theme.subtitle, primary: theme.primary, background: theme.card, onSurfaceVariant: theme.primary, onSurface: theme.text } }}
                                    style={{ color: theme.text, backgroundColor: theme.card }}
                                    selectionColor={theme.primary}
                                    textColor={theme.text}
                                />
                            )}
                        />

                        <Controller
                            control={methods.control}
                            name="telephone"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    label="Telefone"
                                    value={value}
                                    onChangeText={onChange}
                                    keyboardType="phone-pad"
                                    mode="outlined"
                                    maxLength={11}
                                    left={
                                        <TextInput.Icon icon="cellphone" />
                                    }
                                    outlineColor={theme.border}
                                    activeOutlineColor={theme.primary}
                                    theme={{ colors: { text: theme.text, placeholder: theme.subtitle, primary: theme.primary, background: theme.card, onSurfaceVariant: theme.primary, onSurface: theme.text } }}
                                    style={{ color: theme.text, backgroundColor: theme.card }}
                                    selectionColor={theme.primary}
                                    textColor={theme.text}
                                />
                            )}
                        />

                        <Controller
                            control={methods.control}
                            name="observation"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    label="Observação"
                                    value={value}
                                    onChangeText={onChange}
                                    mode="outlined"
                                    multiline
                                    numberOfLines={5}
                                    textAlignVertical="top"
                                    left={
                                        <TextInput.Icon icon="note-text-outline" />
                                    }
                                    style={[styles.textArea, { color: theme.text, backgroundColor: theme.card }]}
                                    outlineColor={theme.border}
                                    activeOutlineColor={theme.primary}
                                    theme={{ colors: { text: theme.text, placeholder: theme.subtitle, primary: theme.primary, background: theme.card, onSurfaceVariant: theme.primary, onSurface: theme.text } }}
                                    selectionColor={theme.primary}
                                    textColor={theme.text}
                                />
                            )}
                        />

                    </View>

                    <View>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.buttonSave, { backgroundColor: theme.primary }]}
                                onPress={!isEditing ? methods.handleSubmit(handleSaveClient) : methods.handleSubmit(handleEditClient)}
                            >
                                <Text style={[styles.buttonText, { color: COLORS.white }] }>
                                    Salvar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>

            </FormSheet>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "space-between",
    },

    card: {
        backgroundColor: COLORS.white,
        marginHorizontal: 15,
        marginTop: 15,
        borderRadius: 16,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'flex-start',
        elevation: 3,
    },

    avatar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#ffd8ea',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    avatarText: {
        color: '#d96a9c',
        fontWeight: '700',
        fontSize: 14,
    },

    info: {
        flex: 1,
    },

    nome: {
        fontSize: 15,
        fontWeight: '700',
        color: '#222',
    },

    telefone: {
        marginTop: 6,
        fontSize: 13,
        color: '#777',
    },

    alergia: {
        marginTop: 10,
        fontSize: 13,
        color: '#999',
        lineHeight: 18,
    },

    actions: {
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 75,
        marginLeft: 10,
    },

    form: {
        gap: 10,
    },

    formTitle: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 20,
    },

    textArea: {
        minHeight: 150,
    },

    buttonRow: {
        width: '100%',
        height: 65,
        marginBottom: 15,
        flexDirection: "row",
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

    buttonText: {
        fontSize: 18,
        color: COLORS.white,
    },

    fabContainer: {
        position: 'absolute',
        bottom: 30,
        right: 25,
    },

});
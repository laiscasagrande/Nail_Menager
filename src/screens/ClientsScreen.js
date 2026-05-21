import React, { useRef, useState, useEffect } from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TextInput,
} from 'react-native';

import {
    Feather,
    MaterialIcons,
    Ionicons,
    AntDesign,
    MaterialCommunityIcons,
} from '@expo/vector-icons';

import ActionButtonAdd from '../components/ActionButtonAdd';
import FormSheet from '../components/FormSheet';

import { COLORS } from '../constants/colors';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formCustomer } from '../schemas/customerSchema';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

const clientes = [
    {
        id: '1',
        nome: 'Laís Kaminski Casagrande',
        telefone: '48992051505',
        alergia: 'Alergia à acetona',
    },
    {
        id: '2',
        nome: 'Maria Eduarda',
        telefone: '48999999999',
        alergia: 'Alergia a esmalte em gel',
    },
];

export default function ClientsScreen() {

    const [clienteAberto, setClienteAberto] = useState(null);
    const [sheetIndex, setSheetIndex] = useState(0);
    const [customers, setCustomers] = useState([]);

    const methods = useForm({
        resolver: zodResolver(formCustomer),
        defaultValues: {
            id: "",
            name: "",
            telephone: "",
            observation: "",
        }
    })

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
        bottomSheetRef.current?.snapToIndex(1);
    }

    function fecharSheet() {
        bottomSheetRef.current?.snapToIndex(0);
    }

    // function handleSalvar() {
    //     const novoCliente = {
    //         nome,
    //         telefone,
    //         observacao,
    //     };

    //     console.log(novoCliente);

    //     fecharSheet();

    //     setNome('');
    //     setTelefone('');
    //     setObservacao('');
    // }

    async function handleSaveClient(data) {
        try {
            await addDoc(collection(db, "customers"), {
                name: data.name,
                telephone: data.telephone,
                observation: data.observation,
            });

            bottomSheetRef.current.close()
        } catch (error) {
            console.log(error)
        }
    }

    async function getCustomers() {
        try {
            const customers = await getDocs(collection(db, "customers"));
            const data = customers.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            
            setCustomers(data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCustomers();
    }, [])

    return (
        <>
            <FlatList
                data={customers}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                    paddingTop: 10,
                    paddingBottom: 140,
                }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (

                    <View style={styles.card}>

                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {item.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join('')
                                }
                            </Text>
                        </View>

                        <View style={styles.info}>
                            <Text style={styles.nome}>
                                {item.name}
                            </Text>

                            <Text style={styles.telefone}>
                                {item.telephone}
                            </Text>

                            {clienteAberto === item.id && item.observation && (
                                <Text style={styles.alergia}>
                                    {item.observation}
                                </Text>
                            )}
                        </View>

                        <View style={styles.actions}>

                            <TouchableOpacity>
                                <Feather
                                    name="edit-2"
                                    size={20}
                                    color={COLORS.primary}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <MaterialIcons
                                    name="delete-outline"
                                    size={24}
                                    color={COLORS.primary}
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
                                    color="#bbb"
                                />
                            </TouchableOpacity>

                        </View>

                    </View>

                )}
            />

            <FormSheet
                ref={bottomSheetRef}
                onChange={(index) => setSheetIndex(index)}
            >

                <View style={styles.formContainer}>

                    <View style={styles.form}>

                        <Text style={styles.formTitle}>
                            Cadastrar novo cliente
                        </Text>

                        <View style={styles.inputContainer}>
                            <AntDesign name="user" size={20} color="#c7c7c7" />

                            <Controller
                                control={methods.control}
                                name="name"
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        placeholder="Nome"
                                        placeholderTextColor="#c7c7c7"
                                        style={styles.input}
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                )}
                            >

                            </Controller>
                        </View>

                        <View style={styles.inputContainer}>
                            <Feather name="smartphone" size={20} color="#c7c7c7" />

                            <Controller
                                control={methods.control}
                                name="telephone"
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        placeholder="Telefone"
                                        placeholderTextColor="#c7c7c7"
                                        value={value}
                                        onChangeText={onChange}
                                        keyboardType="phone-pad"
                                        style={styles.input}
                                    />
                                )}
                            >

                            </Controller>
                        </View>

                        <View style={styles.textAreaContainer}>
                            <MaterialCommunityIcons
                                name="hair-dryer"
                                size={22}
                                color="#c7c7c7"
                            />

                            <Controller
                                control={methods.control}
                                name="observation"
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        placeholder="Observação"
                                        placeholderTextColor="#c7c7c7"
                                        multiline
                                        value={value}
                                        onChangeText={onChange}
                                        textAlignVertical="top"
                                        style={styles.textArea}
                                    />
                                )}
                            >

                            </Controller>
                        </View>

                    </View>

                    <View style={styles.containerButton}>
                        <TouchableOpacity
                            style={styles.buttonSave}
                        >
                            <Text style={styles.buttonText} onPress={methods.handleSubmit(handleSaveClient)}>
                                Salvar
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </FormSheet>

        </>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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

    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
    },

    formContainer: {
        flex: 1,
        justifyContent: 'space-between',
        height: '100%',
    },

    form: {
        gap: 14,
    },

    formTitle: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 20,
    },

    inputContainer: {
        height: 60,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 16,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
    },

    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#444',
    },

    textAreaContainer: {
        minHeight: 150,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 16,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        paddingHorizontal: 18,
        paddingTop: 18,
    },

    textArea: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#444',
        minHeight: 120,
    },

    containerButton: {
        marginTop: 20
    },

    buttonSave: {
        height: 60,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },

    buttonText: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.white,
    },

});
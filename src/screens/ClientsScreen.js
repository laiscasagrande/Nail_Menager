import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from 'react-native';

import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';

import ActionButtonAdd from '../components/ActionButtonAdd';

const clientes = [
    {
        id: '1',
        nome: 'Laís Kaminski Casagrande',
        telefone: '48992051505',
        alergia: 'Alergia à acetona',
    },
    {
        id: '2',
        nome: 'Laís Kaminski Casagrande',
        telefone: '48992051505'
    },
];

export default function ClientsScreen() {

    const [clienteAberto, setClienteAberto] = useState(null);

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Feather name="menu" size={26} color="#fff" />
                
                <Text style={styles.headerTitle}>
                    Clientes
                </Text>

                <Feather name="plus" size={26} color="#fff" />
               </View> 

               <FlatList
                data={clientes}
                keyExtractor={(item) => item.id}
                renderItem={({ item}) => (
                    <View style={styles.card}>

                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                LK
                            </Text>
                        </View>

                        <View style={styles.info}>
                            <Text style={styles.nome}>
                                {item.nome}
                            </Text>

                            <Text style={styles.telefone}>
                                {item.telefone}
                            </Text>

                            {clienteAberto} === item.id && item.alergia && (
                                <Text style={styles.alergia}>
                                    {item.alergia}
                                </Text>
                            )

                        </View>

                        <View style={styles.actions}>
                            <Feather
                            name="edit-2"
                            size={20}
                            color='#ff5ba7'
                            />

                            <MaterialIcons
                            name="delete-outline"
                            size={24}
                            color="#ff5ba7"
                            />

                            <TouchableOpacity
                            onPress={() =>
                                setClienteAberto(
                                    clienteAberto === item.id ? null : item.id
                                )
                            }
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

            <View style={styles.fab}>
                <ActionButtonAdd />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },

    header: {
        height: 100,
        backgroundColor: '#ff4fa3',
        paddingTop: 40,
        paddingHorizontal: 20,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    headerTitle:{
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },

    card: {
        backgroundColor:'#fff',

        marginHorizontal: 15,
        marginTop: 15,

        borderRadius: 12,
        padding: 15,

        flexDirection: 'row',

        elevation: 3,
    },

    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,

        backgroundColor: '#ffd8ea',

        justifyContent: 'center',
        alignItems: 'center',

        marginRight: 12,
    },

    avatarText: {
        color: '#d96a9c',
        fontWeight: '700',
    },

    info: {
        flex: 1,
    },

    nome: {
        fontSize: 14,
        fontWeight: '700',
        color: '#222',
    },

    telefone: {
        marginTop: 10,
        fontSize: 12,
        color: '#777',
    },

        alergia: {
        marginTop: 10,
        fontSize: 12,
        color: '#666',
    },

    actions: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
    },
});
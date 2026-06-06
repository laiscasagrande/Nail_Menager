import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { UserCircle } from 'lucide-react-native';
import { auth, db } from '../../../services/firebase';
import {
    updateEmail,
    updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { COLORS } from '../../../constants/colors';
import styles from '../styles';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalDataSchema } from '../../../schemas/personalDataSchema';

export default function PersonalDataScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const { handleSubmit, control, reset } = useForm({
        resolver: zodResolver(personalDataSchema),
        defaultValues: {
            name: '',
            email: ''
        }
    });

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            reset({
                name: user.displayName || '',
                email: user.email || ''
            })
        }
    }, []);

    const onSubmit = async (data) => {
        const user = auth.currentUser;
        if (!user) { Alert.alert('Erro', 'Nenhum usuário autenticado.'); return; }

        setLoading(true);
        try {
            if (data.name !== user.displayName) {
                await updateProfile(user, { displayName: data.name.trim() });
            }
            const sanitizedEmail = data.email.trim();
            if (sanitizedEmail !== user.email) {
                await updateEmail(user, sanitizedEmail);
            }
            await setDoc(
                doc(db, 'users', user.uid),
                { name: data.name.trim(), email: data.email.trim(), updatedAt: new Date() },
                { merge: true }
            );
            Alert.alert('Sucesso', 'Dados atualizados com sucesso.');
            navigation.navigate('Configurações');
        } catch (error) {
            let message = 'Não foi possível atualizar. Tente novamente.';
            if (error.code === 'auth/invalid-email') message = 'Email inválido.';
            else if (error.code === 'auth/email-already-in-use') message = 'Este email já está em uso.';
            else if (error.code === 'auth/requires-recent-login') message = 'Faça login novamente para atualizar informações sensíveis.';
            Alert.alert('Erro', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.containerPersonalData}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Configurações')}>
                    <Text style={styles.headerCancel}>Cancelar</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Dados Pessoais</Text>
                <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color={COLORS.primary} />
                    ) : (
                        <Text style={styles.headerDone}>Concluído</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.contentPersonalData}>

                <View style={styles.avatarSection}>
                    <View style={styles.avatar}>
                        <UserCircle size={48} color={COLORS.primary} />
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.avatarChange}>Alterar foto</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionLabel}>Informações pessoais</Text>
                <View style={styles.group}>
                    <View style={styles.fieldRow}>
                        <Text style={styles.fieldLabel}>Nome</Text>
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={styles.fieldInput}
                                    value={value}
                                    onChangeText={onChange}
                                    placeholder="Digite seu nome"
                                    placeholderTextColor="#ccc"
                                />
                            )}
                        />
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.fieldRow}>
                        <Text style={styles.fieldLabel}>E-mail</Text>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={styles.fieldInput}
                                    value={value}
                                    onChangeText={onChange}
                                    placeholder="Digite seu e-mail"
                                    placeholderTextColor="#ccc"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            )}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
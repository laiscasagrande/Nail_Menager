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
import { useTheme } from '../../../context/ThemeContext';

export default function PersonalDataScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();
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
        <View style={{flex: 1, backgroundColor: theme.background}}>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: theme.card, borderBottomWidth: 0.5, borderBottomColor: theme.border || '#ddd' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Configurações')}>
                    <Text style={{ fontSize: 16, color: COLORS.primary }}>
                        Cancelar
                    </Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>
                    Tema claro/escuro
                </Text>
                <TouchableOpacity disabled={loading} onPress={handleSubmit(onSubmit)}>
                    {loading ? (
                        <ActivityIndicator color={COLORS.primary} />
                    ) : (
                        <Text style={{ fontSize: 16, color: COLORS.primary, fontWeight: '600' }}>
                            Concluído
                        </Text>
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

                <Text style={{fontSize: 11, fontWeight: '600', color: theme.subtitle, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginLeft: 4,}}>Informações pessoais</Text>
                <View style={{backgroundColor: theme.card, borderRadius: 12, marginBottom: 24, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1,}}>
                    <View style={styles.fieldRow}>
                        <Text style={{width: 100, fontSize: 15, color: theme.text}}>Nome</Text>
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={{flex: 1, fontSize: 15, color: theme.text, padding: 0}}
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
                        <Text style={{width: 100, fontSize: 15, color: theme.text}}>E-mail</Text>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={{flex: 1, fontSize: 15, color: theme.text, padding: 0}}
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
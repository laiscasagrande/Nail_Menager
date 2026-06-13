import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../styles";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema } from "../../../schemas/passwordSchema";
import { auth, db } from "../../../services/firebase";
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    sendPasswordResetEmail,
    updateEmail,
    updatePassword,
    updateProfile,
} from 'firebase/auth';
import { COLORS } from "../../../constants/colors";
import { doc, setDoc } from "firebase/firestore";
import { useTheme } from "../../../context/ThemeContext";

export default function PasswordSecurityScreen({ navigation }) {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { theme } = useTheme();

    const { handleSubmit, control, reset, watch } = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const currentPasswordValue = watch('currentPassword');
    const newPasswordValue = watch('newPassword');
    const confirmPasswordValue = watch('confirmPassword');

    const [loading, setLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [resetMessage, setResetMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const onSubmit = async (data) => {
        console.log('Form data:', data);
        const user = auth.currentUser;
        console.log('currentUser', {
            uid: user?.uid,
            email: user?.email,
            providerData: user?.providerData?.map((p) => p.providerId),
        });

        if (!user) {
            Alert.alert('Erro', 'Usuário não encontrado. Faça login novamente.');
            return;
        }

        if (!data.newPassword) {
            Alert.alert('Atenção', 'Digite a nova senha.');
            return;
        }

        if (!data.currentPassword) {
            setPasswordError('A senha atual precisa estar correta.');
            Alert.alert('Atenção', 'A senha atual precisa estar correta.');
            return;
        }

        if (data.newPassword !== data.confirmPassword) {
            Alert.alert('Atenção', 'Senha nova e confirmar senha precisam ser iguais.');
            return;
        }

        const passwordProvider = user.providerData.some((provider) => provider.providerId === 'password');

        if (!passwordProvider) {
            setLoading(false);
            Alert.alert(
                'Conta Google',
                'Esta conta foi criada com o Google. Para alterar a senha, faça login usando o botão Entrar com o Google.'
            );
            return;
        }

        setLoading(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, data.newPassword);
            await auth.currentUser.reload();
            await setDoc(
                doc(db, 'users', user.uid),
                { updatedAt: new Date() },
                { merge: true }
            );
            Alert.alert('Sucesso', 'Senha atualizada com sucesso. Faça logout e entre novamente.');
            reset({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            navigation.navigate('Configurações');
        } catch (error) {
            console.error('Erro updatePassword:', error);
            let message = 'Não foi possível atualizar. Tente novamente.';
            if (error.code === 'auth/wrong-password') {
                message = 'Senha atual incorreta.';
                setPasswordError(message);
            } else if (error.code === 'auth/requires-recent-login') message = 'Faça login novamente para atualizar informações sensíveis.';
            else if (error.code === 'auth/user-not-found') message = 'Conta não encontrada. Faça login novamente.';
            Alert.alert('Erro', `${message} (${error.code || 'unknown'})`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        reset({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setResetMessage('');
        navigation.navigate('Configurações');
    };

    return (
        <View style={{flex: 1, backgroundColor: theme.background}}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: theme.card, borderBottomWidth: 0.5, borderBottomColor: theme.border || '#ddd' }}>
                <TouchableOpacity onPress={handleCancel}>
                    <Text style={{ fontSize: 16, color: COLORS.primary }}>
                        Cancelar
                    </Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>
                    Senha e segurança
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
            <ScrollView style={styles.contentPasswordSecurity}>
                <Text style={{fontSize: 11, fontWeight: '600', color: theme.subtitle, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginLeft: 4,}}>Alterar senha</Text>
                {(currentPasswordValue === '' || (newPasswordValue !== '' && newPasswordValue !== confirmPasswordValue)) && (
                    <Text style={{ fontSize: 13, marginLeft: 4, color: theme.subtitle, marginBottom: 16, lineHeight: 20 }}>
                        {currentPasswordValue === ''
                            ? 'A senha atual precisa estar correta.'
                            : 'Senha nova e confirmar senha precisam ser iguais.'}
                    </Text>
                )}
                <View style={{backgroundColor: theme.card, borderRadius: 12, marginBottom: 24, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1}}>
                    <View style={styles.fieldRow}>
                        <Text style={{width: 100, fontSize: 15, color: theme.text}}>Senha atual</Text>
                        <Controller
                            control={control}
                            name="currentPassword"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={[styles.fieldInput, { color: theme.text }]}
                                    value={value}
                                    onChangeText={(text) => {
                                        setPasswordError('');
                                        onChange(text);
                                    }}
                                    placeholder="••••••••"
                                    placeholderTextColor={theme.subtitle}
                                    secureTextEntry={!showCurrent}
                                />
                            )}
                        />
                        <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                            {showCurrent ? <EyeOff size={16} color="#ccc" /> : <Eye size={16} color="#ccc" />}
                        </TouchableOpacity>
                    </View>
                    {passwordError ? (
                        <Text style={{ color: '#ff5555', fontSize: 13, marginTop: 6, marginLeft: 8 }}>
                            {passwordError}
                        </Text>
                    ) : null}
                    <View style={styles.fieldRow}>
                        <Text style={{width: 100, fontSize: 15, color: theme.text}}>Nova senha</Text>
                        <Controller
                            control={control}
                            name="newPassword"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={[styles.fieldInput, { color: theme.text }]}
                                    value={value}
                                    onChangeText={onChange}
                                    placeholder="••••••••"
                                    placeholderTextColor={theme.subtitle}
                                    secureTextEntry={!showNew}
                                />
                            )}
                        />
                        <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                            {showNew ? <EyeOff size={16} color="#ccc" /> : <Eye size={16} color="#ccc" />}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.fieldRow}>
                        <Text style={{width: 100, fontSize: 15, color: theme.text}}>Confirmar</Text>
                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={[styles.fieldInput, { color: theme.text }]}
                                    value={value}
                                    onChangeText={onChange}
                                    placeholder="••••••••"
                                    placeholderTextColor={theme.subtitle}
                                    secureTextEntry={!showConfirm}
                                />
                            )}
                        />
                        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                            {showConfirm ? <EyeOff size={16} color="#ccc" /> : <Eye size={16} color="#ccc" />}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
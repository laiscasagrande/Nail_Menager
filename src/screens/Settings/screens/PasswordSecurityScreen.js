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
    updateEmail,
    updatePassword,
    updateProfile,
} from 'firebase/auth';
import { COLORS } from "../../../constants/colors";
import { doc, setDoc } from "firebase/firestore";

export default function PasswordSecurityScreen({ navigation }) {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { handleSubmit, control, reset } = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        console.log('Form data:', data);
        const user = auth.currentUser;
        if (data.newPassword && data.newPassword !== data.confirmPassword) {
            Alert.alert('Atenção', 'A senha e a confirmação precisam ser iguais.');
            return;
        }

        setLoading(true);
        try {
            if (data.currentPassword && data.newPassword) {
                const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
                await reauthenticateWithCredential(user, credential);
            }
            if (data.newPassword) {
                await updatePassword(user, data.newPassword);
            }
            await setDoc(
                doc(db, 'users', user.uid),
                { updatedAt: new Date() },
                { merge: true }
            );
            Alert.alert('Sucesso', 'Dados atualizados com sucesso.');
            reset({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
            navigation.navigate('Configurações');
        } catch (error) {
            let message = 'Não foi possível atualizar. Tente novamente.';
            if (error.code === 'auth/wrong-password') message = 'Senha atual incorreta.';
            else if (error.code === 'auth/requires-recent-login') message = 'Faça login novamente para atualizar informações sensíveis.';
            Alert.alert('Erro', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Configurações')}>
                    <Text style={styles.headerCancel}>Cancelar</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Alterar senha</Text>
                <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color={COLORS.primary} />
                    ) : (
                        <Text style={styles.headerDone}>Concluído</Text>
                    )}
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.contentPasswordSecurity}>
                <Text style={styles.sectionLabelPasswordSecurity}>Alterar senha</Text>
                <View style={styles.group}>
                    <View style={styles.fieldRow}>
                        <Text style={styles.fieldLabel}>Senha atual</Text>
                        <Controller
                            control={control}
                            name="currentPassword"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={styles.fieldInput}
                                    value={value}
                                    onChangeText={onChange}
                                    placeholder="••••••••"
                                    placeholderTextColor="#ccc"
                                    secureTextEntry={!showCurrent}
                                />
                            )}
                        />
                        <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                            {showCurrent ? <EyeOff size={16} color="#ccc" /> : <Eye size={16} color="#ccc" />}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.fieldRow}>
                        <Text style={styles.fieldLabel}>Nova senha</Text>
                        <Controller
                            control={control}
                            name="newPassword"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={styles.fieldInput}
                                    value={value}
                                    onChangeText={onChange}
                                    placeholder="••••••••"
                                    placeholderTextColor="#ccc"
                                    secureTextEntry={!showNew}
                                />
                            )}
                        />
                        <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                            {showNew ? <EyeOff size={16} color="#ccc" /> : <Eye size={16} color="#ccc" />}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.fieldRow}>
                        <Text style={styles.fieldLabel}>Confirmar</Text>
                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={styles.fieldInput}
                                    value={value}
                                    onChangeText={onChange}
                                    placeholder="••••••••"
                                    placeholderTextColor="#ccc"
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
        </>
    )
}
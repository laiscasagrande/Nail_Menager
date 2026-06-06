import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth, db } from '../../services/firebase';
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updateEmail,
    updatePassword,
    updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Bell, ChevronRight, UserCircle } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import styles from './styles';
import NotificationsScreen from './components/NotificationsScreen';
import AccountScreen from './components/AccountScreen';
import { Avatar, Card, Divider } from 'react-native-paper';

export default function ConfigurationScreen({ navigation }) {
    const [activeSection, setActiveSection] = useState('account');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState({
        reminders: true,
        promotions: false,
    });
    const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setName(user.displayName || '');
            setEmail(user.email || '');
        }
    }, []);

    const handleToggleNotification = (key) => {
        setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const sanitizeEmail = (value) => value.trim();

    const handleUpdateAccount = async () => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert('Erro', 'Nenhum usuário autenticado.');
            return;
        }

        if (!name.trim()) {
            Alert.alert('Atenção', 'Informe o seu nome.');
            return;
        }

        if (!email.trim()) {
            Alert.alert('Atenção', 'Informe o seu email.');
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            Alert.alert('Atenção', 'A senha e a confirmação precisam ser iguais.');
            return;
        }

        setLoading(true);

        try {
            if (currentPassword && (email !== user.email || newPassword)) {
                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);
            }

            if (name !== user.displayName) {
                await updateProfile(user, { displayName: name.trim() });
            }

            const sanitizedEmail = sanitizeEmail(email);
            if (sanitizedEmail !== user.email) {
                await updateEmail(user, sanitizedEmail);
            }

            if (newPassword) {
                await updatePassword(user, newPassword);
            }

            await setDoc(
                doc(db, 'users', user.uid),
                {
                    name: name.trim(),
                    email: sanitizedEmail,
                    updatedAt: new Date(),
                },
                { merge: true }
            );

            Alert.alert('Sucesso', 'Configurações de conta atualizadas.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error(error);
            let message = 'Não foi possível atualizar a conta. Tente novamente.';

            if (error.code === 'auth/invalid-email') {
                message = 'Email inválido.';
            } else if (error.code === 'auth/email-already-in-use') {
                message = 'Este email já está em uso.';
            } else if (error.code === 'auth/wrong-password') {
                message = 'Senha atual incorreta.';
            } else if (error.code === 'auth/requires-recent-login') {
                message = 'Faça login novamente para atualizar informações sensíveis.';
            }

            Alert.alert('Erro', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>

            <View style={styles.cardRow}>
                <Text style={styles.sectionLabelPersonalData}>Meu perfil</Text>
                <Card style={styles.card}>
                    <Card.Content>
                        <TouchableOpacity
                            style={[styles.optionCard]}
                            onPress={() => navigation.navigate('PersonalData')}
                        >
                            <View style={styles.description}>
                                <View style={styles.optionIcon}>
                                    <UserCircle size={22} color={COLORS.primary} />
                                </View>
                                <View>
                                    <Text style={styles.optionLabel}>Dados pessoais</Text>
                                    <Text style={styles.optionText}>Nome, email</Text>
                                </View>
                            </View>

                            <ChevronRight size={18} color="#999" />
                        </TouchableOpacity>
                        <Divider />
                        <TouchableOpacity
                            style={[styles.optionCard]}
                            onPress={() => navigation.navigate('PasswordSecurity')}
                        >
                            <View style={styles.description}>
                                <View style={styles.optionIcon}>
                                    <Bell size={22} color={COLORS.primary} />
                                </View>
                                <View>
                                    <Text style={styles.optionLabel}>Senha e segurança</Text>
                                    <Text style={styles.optionText}>Alterar senha</Text>
                                </View>
                            </View>
                            <ChevronRight size={18} color="#999" />
                        </TouchableOpacity>
                    </Card.Content>
                </Card>

                <Text style={styles.sectionLabelPersonalData}>Notificações</Text>
                <Card style={styles.card}>
                    <Card.Content>
                        <TouchableOpacity
                            style={[styles.optionCard]}
                            onPress={() => navigation.navigate('RemindersScreen')}
                        >
                            <View style={styles.description}>
                                <View style={styles.optionIcon}>
                                    <UserCircle size={22} color={COLORS.primary} />
                                </View>
                                <View>
                                    <Text style={styles.optionLabel}>Lembretes</Text>
                                    <Text style={styles.optionText}>Push, SMS ou email</Text>
                                </View>
                            </View>
                            <ChevronRight size={18} color="#999" />
                        </TouchableOpacity>
                        <Divider />
                        <TouchableOpacity
                            style={[styles.optionCard]}
                            onPress={() => setActiveSection('notifications')}
                        >
                            <View style={styles.description}>
                                <View style={styles.optionIcon}>
                                    <UserCircle size={22} color={COLORS.primary} />
                                </View>
                                <View>
                                    <Text style={styles.optionLabel}>Mensagem automática</Text>
                                    <Text style={styles.optionText}>Confirmação e lembretes</Text>
                                </View>
                            </View>
                            <ChevronRight size={18} color="#999" />
                        </TouchableOpacity>
                    </Card.Content>
                </Card>

                <Text style={styles.sectionLabelPersonalData}>Aparência</Text>
                <Card style={styles.card}>
                    <Card.Content>
                        <TouchableOpacity
                            style={[styles.optionCard]}
                            onPress={() => setActiveSection('account')}
                        >
                            <View style={styles.description}>
                                <View style={styles.optionIcon}>
                                    <UserCircle size={22} color={COLORS.primary} />
                                </View>
                                <View>
                                    <Text style={styles.optionLabel}>Tema</Text>
                                    <Text style={styles.optionText}>Claro, escuro</Text>
                                </View>
                            </View>
                            <ChevronRight size={18} color="#999" />
                        </TouchableOpacity>
                    </Card.Content>
                </Card>

                <Text style={styles.sectionLabelPersonalData}>Conta</Text>
                <Card style={styles.card}>
                    <Card.Content>
                        <TouchableOpacity
                            style={[styles.optionCard]}
                            onPress={() => setActiveSection('account')}
                        >
                            <View style={styles.description}>
                                <View style={styles.optionIcon}>
                                    <UserCircle size={22} color={COLORS.primary} />
                                </View>
                                <Text style={styles.optionLabel}>Ajuda e suporte</Text>
                            </View>
                            <ChevronRight size={18} color="#999" />
                        </TouchableOpacity>
                        <Divider />
                        <TouchableOpacity
                            style={[styles.optionCard]}
                            onPress={() => setActiveSection('notifications')}
                        >
                            <View style={styles.description}>
                                <View style={styles.optionIcon}>
                                    <UserCircle size={22} color={COLORS.primary} />
                                </View>
                                <Text style={styles.optionLabel}>Termos e privacidade</Text>
                            </View>
                            <ChevronRight size={18} color="#999" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.optionCard]}
                            onPress={() => setActiveSection('notifications')}
                        >
                            <View style={styles.description}>
                                <View style={styles.optionIcon}>
                                    <UserCircle size={22} color={COLORS.primary} />
                                </View>
                                <Text style={styles.optionLabel}>Sair da conta</Text>
                            </View>
                            <ChevronRight size={18} color="#999" />
                        </TouchableOpacity>
                    </Card.Content>
                </Card>
            </View>

            {activeSection === 'account' ? (
                <AccountScreen
                    name={name}
                    email={email}
                    currentPassword={currentPassword}
                    newPassword={newPassword}
                    confirmPassword={confirmPassword}
                    loading={loading}
                    onChangeName={setName}
                    onChangeEmail={setEmail}
                    onChangeCurrentPassword={setCurrentPassword}
                    onChangeNewPassword={setNewPassword}
                    onChangeConfirmPassword={setConfirmPassword}
                    onSubmit={handleUpdateAccount}
                />
            ) : (
                <NotificationsScreen notifications={notifications} onToggle={handleToggleNotification} />
            )}
        </ScrollView>
    );
}

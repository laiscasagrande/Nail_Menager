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
import { useTheme } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';

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
    const { theme } = useTheme();
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

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsLoggedIn(false);
        } catch (error) {
            console.error('Erro ao sair:', error);
            Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
        }
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={styles.content}>
            <View style={styles.cardRow}>

                <Text style={{ fontSize: 11, fontWeight: '600', color: theme.subtitle, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginLeft: 4 }}>Meu perfil</Text>
                <Card style={{ backgroundColor: theme.card, marginBottom: 20 }}>
                    <Card.Content>
                        <TouchableOpacity
                            style={{ backgroundColor: theme.card, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                            onPress={() => navigation.navigate('PersonalData')}
                        >
                            <View style={styles.description}>
                                <View style={styles.optionIcon}>
                                    <UserCircle size={22} color={COLORS.primary} />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.primary }}>Dados pessoais</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: theme.subtitle }}>Nome, email</Text>
                                </View>
                            </View>
                            <ChevronRight size={18} color="#999" />
                        </TouchableOpacity>
                        <Divider />
                        <TouchableOpacity
                            style={{ backgroundColor: theme.card, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                            onPress={() => navigation.navigate('PasswordSecurity')}
                        >
                            <View style={styles.description}>
                                <View style={styles.optionIcon}>
                                    <Bell size={22} color={COLORS.primary} />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.primary }}>Senha e segurança</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: theme.subtitle }}>Alterar senha</Text>
                                </View>
                            </View>
                            <ChevronRight size={18} color="#999" />
                        </TouchableOpacity>
                    </Card.Content>
                </Card>

                <Text style={{ fontSize: 11, fontWeight: '600', color: theme.subtitle, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginLeft: 4 }}>Notificações</Text>
                <Card style={{ backgroundColor: theme.card, marginBottom: 20 }}>
                    <Card.Content>
                        <TouchableOpacity
                            style={{ backgroundColor: theme.card, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                            onPress={() => navigation.navigate('RemindersScreen')}
                        >
                            <View style={styles.description}>
                                <View style={styles.optionIcon}>
                                    <UserCircle size={22} color={COLORS.primary} />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.primary }}>Lembretes</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: theme.subtitle }}>Push, SMS ou email</Text>
                                </View>
                            </View>
                            <ChevronRight size={18} color="#999" />
                        </TouchableOpacity>
                        <Divider />
                        <TouchableOpacity
                            style={{ backgroundColor: theme.card, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                            onPress={() => navigation.navigate('AutomaticMessage')}
                        >
                            <View style={styles.description}>
                                <View style={styles.optionIcon}>
                                    <UserCircle size={22} color={COLORS.primary} />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.primary }}>Mensagem automática</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: theme.subtitle }}>Confirmação e lembretes</Text>
                                </View>
                            </View>
                            <ChevronRight size={18} color="#999" />
                        </TouchableOpacity>
                    </Card.Content>
                </Card>

                <Text style={{ fontSize: 11, fontWeight: '600', color: theme.subtitle, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginLeft: 4 }}>Aparência</Text>
                <Card style={{ backgroundColor: theme.card, marginBottom: 20 }}>
                    <Card.Content>
                        <TouchableOpacity
                            style={{ backgroundColor: theme.card, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                            onPress={() => navigation.navigate('Theme')}
                        >
                            <View style={styles.description}>
                                <View style={styles.optionIcon}>
                                    <UserCircle size={22} color={COLORS.primary} />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.primary }}>Tema</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: theme.subtitle }}>Claro, escuro</Text>
                                </View>
                            </View>
                            <ChevronRight size={18} color="#999" />
                        </TouchableOpacity>
                    </Card.Content>
                </Card>

                <Text style={{ fontSize: 11, fontWeight: '600', color: theme.subtitle, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginLeft: 4 }}>Conta</Text>
                <Card style={{ backgroundColor: theme.card, marginBottom: 20 }}>
                    <Card.Content>
                        <TouchableOpacity
                            style={{backgroundColor: theme.card, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
                            onPress={() => setActiveSection('account')}
                        >
                            <View style={styles.description}>
                                <View style={styles.optionIcon}>
                                    <UserCircle size={22} color={COLORS.primary} />
                                </View>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.primary }}>Ajuda e suporte</Text>
                            </View>
                            <ChevronRight size={18} color="#999" />
                        </TouchableOpacity>
                        <Divider />
                        <TouchableOpacity
                            style={{backgroundColor: theme.card, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
                            onPress={() => setActiveSection('notifications')}
                        >
                            <View style={styles.description}>
                                <View style={styles.optionIcon}>
                                    <UserCircle size={22} color={COLORS.primary} />
                                </View>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.primary }}>Termos e privacidade</Text>
                            </View>
                            <ChevronRight size={18} color="#999" />
                        </TouchableOpacity>
                        <Divider />
                        <TouchableOpacity
                            style={{backgroundColor: theme.card, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
                            onPress={() => setActiveSection('notifications')}
                        >
                            <View style={styles.description}>
                                <View style={styles.optionIcon}>
                                    <UserCircle size={22} color={COLORS.primary} />
                                </View>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.primary }}>Sair da conta</Text>
                            </View>
                            <ChevronRight size={18} color="#999" />
                        </TouchableOpacity>
                    </Card.Content>
                </Card>

            </View>
        </ScrollView>
    );
}
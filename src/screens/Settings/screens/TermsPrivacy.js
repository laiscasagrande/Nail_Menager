import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { ActivityIndicator } from "react-native";
import { Card } from "react-native-paper";
import { COLORS } from "../../../constants/colors";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import { auth, db } from "../../../services/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";

export default function TermsPrivacy({ navigation }) {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [openTerms, setOpenTerms] = useState(false);
    const [openPrivacy, setOpenPrivacy] = useState(false);
    const [openCookies, setOpenCookies] = useState(false);

    async function handleDeleteAccount() {
        Alert.alert(
            'Excluir conta',
            'Tem certeza que deseja excluir sua conta? Todos os seus dados serão removidos permanentemente.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const user = auth.currentUser;
                            await deleteDoc(doc(db, 'users', user.uid));
                            await deleteUser(user);
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível excluir a conta. Tente fazer login novamente.');
                            console.log(error);
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: theme.card, borderBottomWidth: 0.5, borderBottomColor: theme.border || '#ddd' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Configurações')}>
                    <Text style={{ fontSize: 16, color: COLORS.primary }}>Cancelar</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>Termos e Privacidade</Text>
                <View style={{ width: 60 }} />
            </View>

            <Text style={{ fontSize: 11, fontWeight: '600', color: theme.subtitle, textTransform: 'uppercase', letterSpacing: 0.8, marginRight: 16, marginLeft: 16, marginTop: 16 }}>Documentos</Text>

            <Card style={{ padding: 10, marginLeft: 16, marginRight: 16, marginTop: 8, marginBottom: 10, backgroundColor: theme.card }}>
                <Card.Content>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 15, color: theme.text }}>Termos de uso</Text>
                        {!openTerms
                            ? <ChevronRight onPress={() => setOpenTerms(true)} color={theme.text} />
                            : <ChevronDown onPress={() => setOpenTerms(false)} color={theme.text} />}
                    </View>
                    {openTerms && (
                        <View style={{ marginTop: 15 }}>
                            <Text style={{ fontSize: 14, color: theme.text, lineHeight: 22 }}>
                                Ao utilizar o Nail Manager, você concorda com estes termos. O aplicativo é destinado exclusivamente ao gerenciamento de agendamentos e clientes de profissionais da área de manicure. É proibido o uso indevido, compartilhamento de credenciais ou qualquer atividade que comprometa a segurança do sistema. Reservamo-nos o direito de encerrar contas que violem estes termos.
                            </Text>
                        </View>
                    )}
                </Card.Content>
            </Card>

            <Card style={{ padding: 10, marginLeft: 16, marginRight: 16, marginTop: 8, marginBottom: 10, backgroundColor: theme.card }}>
                <Card.Content>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 15, color: theme.text }}>Política de privacidade</Text>
                        {!openPrivacy
                            ? <ChevronRight onPress={() => setOpenPrivacy(true)} color={theme.text} />
                            : <ChevronDown onPress={() => setOpenPrivacy(false)} color={theme.text} />}
                    </View>
                    {openPrivacy && (
                        <View style={{ marginTop: 15 }}>
                            <Text style={{ fontSize: 14, color: theme.text, lineHeight: 22 }}>
                                Coletamos apenas os dados necessários para o funcionamento do app, como nome, e-mail e informações de agendamento. Seus dados não são compartilhados com terceiros e são armazenados com segurança no Firebase. Você pode solicitar a exclusão dos seus dados a qualquer momento através das configurações do app. Cumprimos integralmente a Lei Geral de Proteção de Dados (LGPD).
                            </Text>
                        </View>
                    )}
                </Card.Content>
            </Card>

            <Card style={{ padding: 10, marginLeft: 16, marginRight: 16, marginTop: 8, marginBottom: 10, backgroundColor: theme.card }}>
                <Card.Content>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 15, color: theme.text }}>Política de cookies</Text>
                        {!openCookies
                            ? <ChevronRight onPress={() => setOpenCookies(true)} color={theme.text} />
                            : <ChevronDown onPress={() => setOpenCookies(false)} color={theme.text} />}
                    </View>
                    {openCookies && (
                        <View style={{ marginTop: 15 }}>
                            <Text style={{ fontSize: 14, color: theme.text, lineHeight: 22 }}>
                                O Nail Manager não utiliza cookies de rastreamento ou publicidade. Utilizamos apenas dados de sessão para manter você autenticado e garantir o funcionamento correto do aplicativo. Esses dados são temporários e removidos automaticamente ao encerrar a sessão.
                            </Text>
                        </View>
                    )}
                </Card.Content>
            </Card>

            <Text style={{ fontSize: 11, fontWeight: '600', color: theme.subtitle, textTransform: 'uppercase', letterSpacing: 0.8, marginRight: 16, marginLeft: 16, marginTop: 16 }}>Seus dados</Text>

            <Card style={{ padding: 10, marginLeft: 16, marginRight: 16, marginTop: 8, backgroundColor: theme.card }}>
                <Card.Content>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                        onPress={handleDeleteAccount}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator color={COLORS.primary} />
                            : <Text style={{ fontSize: 15, color: '#bf360c' }}>Excluir minha conta</Text>
                        }
                        <ChevronRight color="#bf360c" />
                    </TouchableOpacity>
                </Card.Content>
            </Card>

        </View>
    );
}
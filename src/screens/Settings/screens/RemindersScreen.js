import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Avatar, Button, Card, Checkbox, Chip, Divider, RadioButton, Switch } from "react-native-paper";
import { COLORS } from "../../../constants/colors";
import styles from "../styles";
import { ActivityIndicator } from "react-native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../services/firebase";

export default function RemindersScreen({ navigation }) {
    const LeftContent = props => <Avatar.Icon {...props} icon="folder" />
    const [on, setOn] = useState(false);
    const [push, setPush] = useState(false);
    const [email, setEmail] = useState(false);
    const [loading, setLoading] = useState(false);
    const user = auth.currentUser;

    async function handleSavePreferencesNotificationsUser() {
        
        try {
            await setDoc(doc(db, 'users', user.uid), {
                notificationPreferences: {
                    push: push,
                    email: email,
                }
            }, { merge: true })
        } catch (error) {
            console.log('Error saving notification preferences:', error);
        }
    }

    async function loadPreferencesNotificationsUser() {
        try{
            const docSnap = await getDoc(doc(db, 'users', user.uid))
            if (docSnap.exists()) {
                const preferences = docSnap.data().notificationPreferences;
                if (preferences) {
                    setPush(preferences.push);
                    setEmail(preferences.email);
                    setOn(preferences.push || preferences.email);
                }
            }
        } catch (error) {
            console.log('Error loading notification preferences:', error);
        }
    }

    useEffect(() => {
        loadPreferencesNotificationsUser();
    }, []);

    return (
        <>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Configurações')}>
                    <Text style={styles.headerCancel}>Cancelar</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Lembretes Notificações</Text>
                <TouchableOpacity disabled={loading} onPress={handleSavePreferencesNotificationsUser}>
                    {loading ? (
                        <ActivityIndicator color={COLORS.primary} />
                    ) : (
                        <Text style={styles.headerDone}>Concluído</Text>
                    )}
                </TouchableOpacity>
            </View>
            <Text style={{fontSize: 11, fontWeight: '600', color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.8, marginRight: 16, marginLeft: 16, marginTop: 16}}>Canais de Notificações</Text>
            <Card style={{ padding: 10, marginLeft: 16, marginRight: 16, marginTop: 8 }}>
                <Card.Content>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <Text style={{ fontSize: 15, color: '#000' }}>Novo Agendamento</Text>
                            <Text style={{ fontSize: 14, color: '#666' }}>Escolha como deseja ser lembrado</Text>
                        </View>
                        <View>
                            <Switch value={on} onValueChange={setOn} color={COLORS.primary} />
                        </View>
                    </View>
                    {on && (
                        <View style={{ marginTop: 20 }}>
                            <Divider />
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text></Text>
                                <Text style={{ fontSize: 16, color: '#000' }}>Push</Text>
                                <Checkbox.Item
                                    status={push ? 'checked' : 'unchecked'}
                                    onPress={() => setPush(!push)}
                                    color={COLORS.primary}
                                />
                            </View>
                            <Divider />
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text></Text>
                                <Text style={{ fontSize: 16, color: '#000' }}>E-mail</Text>
                                <Checkbox.Item
                                    status={email ? 'checked' : 'unchecked'}
                                    onPress={() => setEmail(!email)}
                                    color={COLORS.primary}
                                />
                            </View>
                        </View>
                    )}
                </Card.Content>
            </Card>
        </>
    )
}
import { useEffect, useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import { Card, Checkbox, Chip, Divider } from "react-native-paper";
import { COLORS } from "../../../constants/colors";
import styles from "../styles";
import { ActivityIndicator } from "react-native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../services/firebase";
import DatePickerModal from "../components/DatePickerModal";
import * as Notifications from 'expo-notifications';

export default function AutomaticMessage({ navigation }) {

    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false)
    const [minutes, setMinutes] = useState(0);
    const [hours, setHours] = useState(0);
    const [preferredDays, setPreferredDays] = useState([])
    const user = auth.currentUser;

    const days = [{
        key: 0,
        name: 'Segunda-feira'
    },
    {
        key: 1,
        name: 'Terça-feira'
    },
    {
        key: 2,
        name: 'Quarta-feira'
    },
    {
        key: 3,
        name: 'Quinta-feira'
    },
    {
        key: 4,
        name: 'Sexta-feira'
    },
    {
        key: 5,
        name: 'Sábado'
    },
    {
        key: 6,
        name: 'Domingo'
    }]

    async function scheduleDailyNotification(hours, minutes, days) {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'Agendamentos',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
            });
        }

        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Atenção', 'Permissão de notificação negada.');
            return;
        }

        await Notifications.cancelAllScheduledNotificationsAsync();

        for (const day of days) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Resumo do dia 💅',
                    body: 'Confira seus agendamentos de hoje!',
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                    weekday: day === 6 ? 1 : day + 2,
                    hour: hours,
                    minute: minutes,
                },
            });
        }
    }

    async function handleSavePreferencesSchedulesDays() {
        setLoading(true);
        try {
            await setDoc(doc(db, 'users', user.uid), {
                summarySchedule: {
                    time: {
                        hours: hours,
                        minutes: minutes
                    },
                    days: preferredDays,
                }
            }, { merge: true })
            await scheduleDailyNotification(hours, minutes, preferredDays);
            Alert.alert('Sucesso', 'Preferências salvas!');
            navigation.navigate('Configurações')
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar.');
            console.log("error: ", error);
        } finally {
            setLoading(false);
        }
    }

    async function loadPreferencesSchedulesDays() {
        try {
            const docSnap = await getDoc(doc(db, 'users', user.uid));
            const data = docSnap.data()?.summarySchedule;
            if (data) {
                setHours(data.time.hours);
                setMinutes(data.time.minutes);
                setPreferredDays(data.days);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadPreferencesSchedulesDays()
    }, []);

    return (
        <>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Configurações')}>
                    <Text style={styles.headerCancel}>Cancelar</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notificação Automática</Text>
                <TouchableOpacity disabled={loading} onPress={handleSavePreferencesSchedulesDays}>
                    {loading ? (
                        <ActivityIndicator color={COLORS.primary} />
                    ) : (
                        <Text style={styles.headerDone}>Concluído</Text>
                    )}
                </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.8, marginRight: 16, marginLeft: 16, marginTop: 16 }}>Resumo Diário</Text>
            <Card style={{ padding: 10, marginLeft: 16, marginRight: 16, marginTop: 8 }}>
                <Card.Content>
                    <View>
                        <Text style={{ fontSize: 15, color: '#000' }}>Notificações de Agendamento</Text>
                        <Text style={{ fontSize: 14, color: '#666' }}>Seja notificado dos agendamentos do dia</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 16, color: '#000' }}>Horário do envio</Text>
                            <Chip style={{ backgroundColor: COLORS.primary }} textStyle={{ color: '#fff' }} onPress={() => setVisible(true)}>{`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`}</Chip>
                        </View>
                    </View>
                </Card.Content>
            </Card>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.8, marginRight: 16, marginLeft: 16, marginTop: 16 }}>Dias de Recebimento</Text>
            <Card style={{ padding: 10, marginLeft: 16, marginRight: 16, marginTop: 8 }}>
                <Card.Content>
                    {days.map((day) => (
                        <View key={day.key} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text></Text>
                            <Text style={{ fontSize: 16, color: '#000' }}>{day.name}</Text>
                            <Checkbox.Item
                                status={preferredDays.includes(day.key) ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setPreferredDays(prev => prev.includes(day.key) ? prev.filter(k => k !== day.key) : [...prev, day.key]);
                                }}
                                color={COLORS.primary}
                            />
                        </View>
                    ))}
                </Card.Content>
            </Card>
            <DatePickerModal
                visible={visible}
                setVisible={setVisible}
                minutes={minutes}
                setMinutes={setMinutes}
                hours={hours}
                setHours={setHours}
            />
        </>
    )
}
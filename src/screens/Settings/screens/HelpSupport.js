import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { ActivityIndicator } from "react-native";
import { Card } from "react-native-paper";
import { COLORS } from "../../../constants/colors";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react-native";

export default function HelpSupport({ navigation }) {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false)
    const [openTextScheduling, setOpenTextScheduling] = useState(false)
    const [openTextRegistration, setOpenTextRegistration] = useState(false)
    const [openTextNotifications, setOpenTextNotifications] = useState(false)


    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: theme.card, borderBottomWidth: 0.5, borderBottomColor: theme.border || '#ddd' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Configurações')}>
                    <Text style={{ fontSize: 16, color: COLORS.primary }}>Cancelar</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>Ajuda e Suporte</Text>
                <View style={{ width: 60 }} />
            </View>
            <Text style={{ fontSize: 11, fontWeight: '600', color: theme.subtitle, textTransform: 'uppercase', letterSpacing: 0.8, marginRight: 16, marginLeft: 16, marginTop: 16 }}>Dúvidas Frequentes</Text>
            <Card style={{ padding: 10, marginLeft: 16, marginRight: 16, marginTop: 8, marginBlock: 10, backgroundColor: theme.card }}>
                <Card.Content>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ fontSize: 15, color: theme.text }}>Como gerenciar agendamentos?</Text>
                        </View>
                        {!openTextScheduling ? <ChevronRight onPress={() => setOpenTextScheduling(true)} color={theme.text} /> : <ChevronDown onPress={() => setOpenTextScheduling(false)} color={theme.text} />}
                    </View>
                    {openTextScheduling &&
                        <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 15, color: theme.text }}>
                                Na tela Horários Agendados, você pode visualizar, cadastrar, editar, cancelar e concluir agendamentos. Os compromissos são exibidos em um calendário para facilitar a organização da agenda.

                                Também é possível arrastar os agendamentos para outros horários ou datas, tornando o reagendamento mais rápido e prático. Basta selecionar o agendamento desejado e movê-lo para a posição desejada no calendário.
                            </Text>
                        </View>
                    }
                </Card.Content>
            </Card>

            <Card style={{ padding: 10, marginLeft: 16, marginRight: 16, marginTop: 8, marginBlock: 10, backgroundColor: theme.card }}>
                <Card.Content>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ fontSize: 15, color: theme.text }}>Como cadastrar clientes/serviços?</Text>
                        </View>
                        {!openTextRegistration ? <ChevronRight onPress={() => setOpenTextRegistration(true)} color={theme.text} /> : <ChevronDown onPress={() => setOpenTextRegistration(false)} color={theme.text} />}
                    </View>
                    {openTextRegistration &&
                        <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 15, color: theme.text }}>
                                Acesse as telas Clientes ou Serviços pelo menu principal para realizar novos cadastros. Preencha as informações solicitadas e toque em Salvar para concluir o cadastro.

                                Após cadastrados, clientes e serviços podem ser consultados e editados sempre que necessário, mantendo as informações atualizadas e facilitando o gerenciamento do seu negócio.
                            </Text>
                        </View>
                    }
                </Card.Content>
            </Card>

            <Card style={{ padding: 10, marginLeft: 16, marginRight: 16, marginTop: 8, marginBlock: 10, backgroundColor: theme.card }}>
                <Card.Content>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ fontSize: 15, color: theme.text }}>Como configurar notificações?</Text>
                        </View>
                        {!openTextNotifications ? <ChevronRight onPress={() => setOpenTextNotifications(true)} color={theme.text} /> : <ChevronDown onPress={() => setOpenTextNotifications(false)} color={theme.text} />}
                    </View>
                    {openTextNotifications &&
                        <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 15, color: theme.text }}>
                                Para configurar suas notificações, acesse Configurações → Lembretes.
                                Lá você pode escolher como deseja ser notificado sobre novos agendamentos.
                                Para configurar o resumo diário da sua agenda, acesse Configurações → Mensagem Automática. Você pode escolher o horário e os dias da semana que deseja receber o resumo.
                            </Text>
                        </View>
                    }
                </Card.Content>
            </Card>
        </View>
    )
}
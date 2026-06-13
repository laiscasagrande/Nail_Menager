import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../constants/colors";
import styles from "../styles";
import { ActivityIndicator, Card, Divider } from "react-native-paper";
import { useTheme } from "../../../context/ThemeContext";

export default function Theme({ navigation }) {
    const [loading, setLoading] = useState(false)
    const { theme, handleSavePreferencesTheme, selectedTheme, setSelectedTheme } = useTheme();

    const handleSaveTheme = async () => {
        setLoading(true);
        await handleSavePreferencesTheme();
        setLoading(false);
        navigation.navigate('Configurações');
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: theme.card, borderBottomWidth: 0.5, borderBottomColor: theme.border || '#ddd' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Configurações')}>
                    <Text style={{ fontSize: 16, color: COLORS.primary }}>
                        Cancelar
                    </Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>
                    Tema claro/escuro
                </Text>
                <TouchableOpacity disabled={loading} onPress={handleSaveTheme}>
                    {loading ? (
                        <ActivityIndicator color={COLORS.primary} />
                    ) : (
                        <Text style={{ fontSize: 16, color: COLORS.primary, fontWeight: '600' }}>
                            Concluído
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 11, fontWeight: '600', color: theme.subtitle, textTransform: 'uppercase', letterSpacing: 0.8, marginRight: 16, marginLeft: 16, marginTop: 16 }}>Tema Interface</Text>
            <Card style={{ padding: 10, marginLeft: 16, marginRight: 16, marginTop: 8, backgroundColor: theme.card }}>
                <Card.Content>
                    <View>
                        <Text style={{ fontSize: 15, color: theme.text }}>Tema da Interface</Text>
                        <Text style={{ fontSize: 14, color: theme.subtitle }}>Escolha o tema que combina com você</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', gap: 10 }}>
                            <TouchableOpacity
                                style={{ flex: 1, padding: 12, borderRadius: 12, borderWidth: selectedTheme === 'light' ? 2 : 1, borderColor: selectedTheme === 'light' ? COLORS.primary : COLORS.black, alignItems: 'center', backgroundColor: '#FFF', }}
                                onPress={() => setSelectedTheme('light')}
                            >
                                <View style={{ width: 100, height: 70, backgroundColor: '#FFF', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#DDD', }}>
                                    <View style={{ height: 15, backgroundColor: '#E84D9A', }} />
                                    <View style={{ flex: 1, flexDirection: 'row', padding: 4 }}>
                                        <View style={{ width: 20, backgroundColor: '#EEE', borderRadius: 4, }} />
                                        <View style={{ flex: 1, marginLeft: 4, backgroundColor: '#F8F8F8', borderRadius: 4, }} />
                                    </View>
                                </View>
                                <Text style={{ marginTop: 10, fontSize: 16, fontWeight: '600', color: '#000' }}>
                                    Claro
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flex: 1, padding: 12, borderRadius: 12, borderWidth: selectedTheme === 'dark' ? 2 : 1, borderColor: selectedTheme === 'dark' ? COLORS.primary : COLORS.black, alignItems: 'center', backgroundColor: '#FFF', }}
                                onPress={() => setSelectedTheme('dark')}
                            >
                                <View style={{ width: 100, height: 70, backgroundColor: '#1E1E1E', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#DDD', }}>
                                    <View style={{ height: 15, backgroundColor: '#E84D9A', }} />
                                    <View style={{ flex: 1, flexDirection: 'row', padding: 4 }}>
                                        <View style={{ width: 20, backgroundColor: '#333', borderRadius: 4, }} />
                                        <View style={{ flex: 1, marginLeft: 4, backgroundColor: '#2A2A2A', borderRadius: 4, }} />
                                    </View>
                                </View>
                                <Text style={{ marginTop: 10, fontSize: 16, fontWeight: '600', color: '#000' }}>
                                    Escuro
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </View>
    )
}
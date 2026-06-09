import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "./components/CustomDrawerContent";
import HeaderButton from "./components/HeaderButton";
import { ChartColumnBig, Clock, Coffee, HandCoins, Settings, Sparkles, UsersRound } from "lucide-react-native";
import { StyleSheet } from "react-native";
import ScheduleScreen from "../screens/ScheduleScreen";
import { COLORS } from "../constants/colors";
import { ICONS } from "../constants/icons";
import BillingScreen from "../screens/BillingScreen";
import SchedulingScreen from "../screens/SchedulingScreen";
import ScreenServices from "../screens/screenServices";
import ClientsScreen from "../screens/ClientsScreen";
import ConfigurationScreen from "../screens/Settings";
import PersonalDataScreen from "../screens/Settings/screens/PersonalDataScreen";
import PasswordSecurityScreen from "../screens/Settings/screens/PasswordSecurityScreen";
import RemindersScreen from "../screens/Settings/screens/RemindersScreen";
import AutomaticMessage from "../screens/Settings/screens/AutomaticMessage";
import Theme from "../screens/Settings/screens/Theme";

const DrawerNav = createDrawerNavigator();

export default function DrawerRoutes() {
    return (
        <DrawerNav.Navigator
            screenOptions={styles.defaultScreenOptions}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            <DrawerNav.Screen
                name="Horários agendados"
                component={SchedulingScreen}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <ICONS.clock />
                    ),
                }}
            />
            <DrawerNav.Screen
                name="Horários disponíveis"
                component={ScheduleScreen}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <ICONS.coffee />
                    ),
                }}
            />
            <DrawerNav.Screen
                name="Clientes"
                component={ClientsScreen}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <ICONS.usersRound />
                    ),
                }}
            />
            <DrawerNav.Screen
                name="Serviços"
                component={ScreenServices}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <ICONS.sparkles />
                    ),
                }}
            />
            <DrawerNav.Screen
                name="Faturamento"
                component={BillingScreen}
                options={{
                    headerRight: () => <HeaderButton />,
                    drawerIcon: ({ color, size }) => (
                        <ICONS.handCoins />
                    ),
                }}
            />
            <DrawerNav.Screen
                name="Dashboard"
                component={ScheduleScreen}
                options={{
                    headerRight: () => <HeaderButton />,
                    drawerIcon: ({ color, size }) => (
                        <ICONS.chartColumnBig />
                    ),
                }}
            />
            <DrawerNav.Screen
                name="Configurações"
                component={ConfigurationScreen}
                options={{
                    headerShown: true,
                    drawerIcon: ({ color, size }) => (
                        <ICONS.settings />
                    ),
                }}
            />
            <DrawerNav.Screen
                name="PersonalData"
                component={PersonalDataScreen}
                options={{
                    title: 'Dados Pessoais',
                    drawerItemStyle: { display: 'none' }, 
                }}
            />
            <DrawerNav.Screen
                name="PasswordSecurity"
                component={PasswordSecurityScreen}
                options={{
                    title: 'Senha e Segurança',
                    drawerItemStyle: { display: 'none' }, 
                }}
            />
            <DrawerNav.Screen
                name="RemindersScreen"
                component={RemindersScreen}
                options={{
                    title: 'Lembretes',
                    drawerItemStyle: { display: 'none' }, 
                }}
            />
            <DrawerNav.Screen
                name="AutomaticMessage"
                component={AutomaticMessage}
                options={{
                    title: 'Mensagem Automática',
                    drawerItemStyle: { display: 'none' }, 
                }}
            />
            <DrawerNav.Screen
                name="Theme"
                component={Theme}
                options={{
                    title: 'Tema',
                    drawerItemStyle: { display: 'none' }, 
                }}
            />
        </DrawerNav.Navigator>
    )
}

const styles = StyleSheet.create({
    defaultScreenOptions: {
        drawerStyle: { backgroundColor: COLORS.primary },
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerTitleStyle: {
            fontSize: 20,
        },
        drawerLabelStyle: { color: '#FFFFFF' },
        drawerActiveBackgroundColor: COLORS.primary
    }
})
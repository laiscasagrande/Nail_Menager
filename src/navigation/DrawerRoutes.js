import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "./components/CustomDrawerContent";
import HeaderButton from "./components/HeaderButton";
import { ChartColumnBig, Clock, Coffee, HandCoins, Settings, Sparkles, UsersRound } from "lucide-react-native";
import { StyleSheet } from "react-native";
import CalendarioTela from "../screens/CalendarioTela";

const DrawerNav = createDrawerNavigator();

export default function DrawerRoutes() {
    return (
        <DrawerNav.Navigator
            screenOptions={styles.defaultScreenOptions}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            <DrawerNav.Screen
                name="Horários agendados"
                component={CalendarioTela}
                options={{
                    headerRight: () => <HeaderButton />,
                    drawerIcon: ({ color, size }) => (
                        <Clock size={size} color='#FFFFFF' />
                    ),
                }}
            />
            <DrawerNav.Screen
                name="Horários disponíveis"
                component={CalendarioTela}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Coffee size={size} color='#FFFFFF' />
                    ),
                }}
            />
            <DrawerNav.Screen
                name="Clientes"
                component={CalendarioTela}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <UsersRound size={size} color='#FFFFFF' />
                    ),
                }}
            />
            <DrawerNav.Screen
                name="Serviços"
                component={CalendarioTela}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Sparkles size={size} color='#FFFFFF' />
                    ),
                }}
            />
            <DrawerNav.Screen
                name="Faturamento"
                component={CalendarioTela}
                options={{
                    headerRight: () => <HeaderButton />,
                    drawerIcon: ({ color, size }) => (
                        <HandCoins size={size} color='#FFFFFF' />
                    ),
                }}
            />
            <DrawerNav.Screen
                name="Dashboard"
                component={CalendarioTela}
                options={{
                    headerRight: () => <HeaderButton />,
                    drawerIcon: ({ color, size }) => (
                        <ChartColumnBig size={size} color='#FFFFFF' />
                    ),
                }}
            />
            <DrawerNav.Screen
                name="Configurações"
                component={CalendarioTela}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Settings size={size} color='#FFFFFF' />
                    ),
                }}
            />
        </DrawerNav.Navigator>
    )
}

const styles = StyleSheet.create({
    defaultScreenOptions: {
        drawerStyle: { backgroundColor: '#E94B97' },
        headerStyle: { backgroundColor: '#E94B97' },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerTitleStyle: {
            fontSize: 20,
        },
        drawerLabelStyle: { color: '#FFFFFF' },
        drawerActiveBackgroundColor: '#E94B97'
    }
})
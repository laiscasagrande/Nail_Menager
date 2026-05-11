import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet } from 'react-native';
import ScheduleScreen from '../screens/ScheduleScreen';

const DrawerNav = createDrawerNavigator();

export default function DrawerRoutes() {
  return (
    <DrawerNav.Navigator
      screenOptions={styles.defaultScreenOptions}
    >
      <DrawerNav.Screen
        name="Agendamentos"
        component={ScheduleScreen}
        options={{
          title: 'Horários agendados',
        }}
      />
    </DrawerNav.Navigator>
  );
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
    drawerActiveBackgroundColor: '#E94B97',
  },
});

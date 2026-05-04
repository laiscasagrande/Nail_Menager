import { NavigationContainer } from '@react-navigation/native';
import CalendarioTela from './screens/CalendarioTela';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HeaderButton from './components/HeaderButton';
import { defaultScreenOptions } from './styles';

const DrawerNav = createDrawerNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <DrawerNav.Navigator
        screenOptions={defaultScreenOptions}
      >
        <DrawerNav.Screen
          name="Calendário"
          component={CalendarioTela}
          options={() => ({
            headerRight: () => (
              <HeaderButton />
            )
          })}
        />
      </DrawerNav.Navigator>
    </NavigationContainer>
  );
}
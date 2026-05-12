import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthenticationScreen from '../screens/AuthenticationScreen';
import DrawerRoutes from './DrawerRoutes';
import { AuthContext } from '../context/AuthContext';


const Stack = createNativeStackNavigator();

export default function RootStack() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name="Auth" component={AuthenticationScreen} />
      ) : (
        <Stack.Screen name="App" component={DrawerRoutes} />
      )}
    </Stack.Navigator>
  );
}

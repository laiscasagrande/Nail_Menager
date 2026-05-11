import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/stack';
import AuthenticationScreen from '../screens/AuthenticationScreen';
import DrawerRoutes from './DrawerRoutes';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isLoggedIn ? (
        <Stack.Screen
          name="Auth"
          component={AuthenticationScreen}
          options={{
            animationEnabled: false,
          }}
          initialParams={{ setIsLoggedIn }}
        />
      ) : (
        <Stack.Screen
          name="App"
          component={DrawerRoutes}
          options={{
            animationEnabled: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
}

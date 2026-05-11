import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthenticationScreen, ScheduleScreen } from '../screens';

const Stack = createNativeStackNavigator();

export default function StackRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="AuthenticationScreen"
        component={AuthenticationScreen}
      />
      <Stack.Screen
        name="ScheduleScreen"
        component={ScheduleScreen}
      />
    </Stack.Navigator>
  );
}

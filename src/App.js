import { StatusBar } from 'expo-status-bar';  
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import CalendarioTela from './screens/CalendarioTela';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName='Calendario'
        screenOptions={{headerShown: false}}
      >
        <Stack.Screen name="Calendario" component={CalendarioTela} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

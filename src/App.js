import React, { useState, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './navigation/RootStack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthContext } from './context/AuthContext';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </GestureHandlerRootView>
    </AuthContext.Provider>
  );
}

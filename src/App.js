import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './navigation/RootStack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthContext } from './context/AuthContext';
import { Provider as PaperProvider } from "react-native-paper";
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import * as Notifications from 'expo-notifications';
import { ThemeProvider } from './context/ThemeContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoggedIn(!!user);
      setAuthChecked(true);
    });

    return unsubscribe;
  }, []);

  if (!authChecked) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider>
            <NavigationContainer>
              <RootStack />
            </NavigationContainer>
          </PaperProvider>
        </GestureHandlerRootView>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

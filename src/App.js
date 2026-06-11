import { useState, useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './navigation/RootStack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthContext } from './context/AuthContext';
import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import * as Notifications from 'expo-notifications';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { darkTheme } from './theme/themes';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function AppContent({ isLoggedIn, setIsLoggedIn }) {
  const { theme } = useTheme();

  const paperTheme = {
    ...PaperDefaultTheme,
    dark: theme.background === darkTheme.background,
    colors: {
      ...PaperDefaultTheme.colors,
      primary: theme.primary,
      background: theme.background,
      surface: theme.card,
      text: theme.text,
      placeholder: theme.subtitle,
      notification: theme.primary,
    },
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={paperTheme}>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </PaperProvider>
      </GestureHandlerRootView>
    </AuthContext.Provider>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state updated:', user ? 'logged in' : 'logged out');
      setIsLoggedIn(!!user);
      setAuthChecked(true);
    });

    return unsubscribe;
  }, []);

  if (!authChecked) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E91E8C" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AppContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

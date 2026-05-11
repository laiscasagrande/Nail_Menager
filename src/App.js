import { NavigationContainer } from '@react-navigation/native';
import DrawerRoutes from './navigation/DrawerRoutes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <NavigationContainer>
          <DrawerRoutes />
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
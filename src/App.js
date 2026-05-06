import { NavigationContainer } from '@react-navigation/native';
import DrawerRoutes from './navigation/DrawerRoutes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <DrawerRoutes />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
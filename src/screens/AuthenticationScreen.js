import React, { useState, useContext } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  Text,
  View,
} from 'react-native';
import ScreenLogin from './ScreenLogin';
import ScreenRegister from './ScreenRegister';
import ScreenWelcome from './ScreenWelcome';
import styles from '../constants/styles';
import { AuthContext } from '../context/AuthContext';


export default function AuthenticationScreen({ navigation }) {
  const [screen, setScreen] = useState('welcome');
  const [loginUser, setLoginUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirm, setRegisterConfirm] = useState('');

  const { setIsLoggedIn } = useContext(AuthContext); // pega do contexto

  const handleGoogleSignIn = () => {
    console.log('Entrar com Google');
  };

  const handleLoginSubmit = () => {
  setIsLoggedIn(true);
};




  const handleRegisterSubmit = () => {
    console.log('Registrar usuário', { registerName, registerPassword, registerConfirm });
    setScreen('login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <RNStatusBar barStyle="dark-content" backgroundColor="#F8D7E7" />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.background} />
        <View style={styles.header}>
          <Text style={styles.logoIcon}>🌸</Text>
        </View>

        {screen === 'welcome' && (
          <ScreenWelcome
            onLoginPress={() => setScreen('login')}
            onRegisterPress={() => setScreen('register')}
            onGoogleSignIn={handleGoogleSignIn}
          />
        )}

        {screen === 'login' && (
          <ScreenLogin
            user={loginUser}
            password={loginPassword}
            onChangeUser={setLoginUser}
            onChangePassword={setLoginPassword}
            onSubmit={handleLoginSubmit}
            onBack={() => setScreen('welcome')}
          />
        )}

        {screen === 'register' && (
          <ScreenRegister
            name={registerName}
            password={registerPassword}
            confirmPassword={registerConfirm}
            onChangeName={setRegisterName}
            onChangePassword={setRegisterPassword}
            onChangeConfirmPassword={setRegisterConfirm}
            onSubmit={handleRegisterSubmit}
            onBack={() => setScreen('welcome')}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

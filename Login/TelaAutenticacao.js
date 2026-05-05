import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  Text,
  View,
} from 'react-native';
import { TelaLogin, TelaCadastro, TelaBoasVindas } from '.';
import styles from './styles';

export default function TelaAutenticacao() {
  const [screen, setScreen] = useState('welcome');
  const [loginUser, setLoginUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirm, setRegisterConfirm] = useState('');

  const handleGoogleSignIn = () => {
    console.log('Entrar com Google');
  };

  const handleLoginSubmit = () => {
    console.log('Login com credenciais', { loginUser, loginPassword });
  };

  const handleRegisterSubmit = () => {
    console.log('Registrar usuário', { registerName, registerPassword, registerConfirm });
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
          <TelaBoasVindas
            onLoginPress={() => setScreen('login')}
            onRegisterPress={() => setScreen('register')}
            onGoogleSignIn={handleGoogleSignIn}
          />
        )}

        {screen === 'login' && (
          <TelaLogin
            user={loginUser}
            password={loginPassword}
            onChangeUser={setLoginUser}
            onChangePassword={setLoginPassword}
            onSubmit={handleLoginSubmit}
            onBack={() => setScreen('welcome')}
          />
        )}

        {screen === 'register' && (
          <TelaCadastro
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
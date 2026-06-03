import React, { useState, useContext, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  Text,
  View,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import ScreenLogin from './ScreenLogin';
import ScreenRegister from './ScreenRegister';
import ScreenWelcome from './ScreenWelcome';
import styles from '../constants/styles';
import { AuthContext } from '../context/AuthContext';
import { auth } from '../services/firebase';
import { db } from '../services/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const getAuthErrorMessage = (code) => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Este email já está em uso.';
    case 'auth/invalid-email':
      return 'Email inválido. Use um Gmail válido.';
    case 'auth/weak-password':
      return 'Senha muito fraca. Use pelo menos 6 caracteres.';
    case 'auth/user-not-found':
      return 'Email não encontrado. Verifique ou registre-se.';
    case 'auth/wrong-password':
      return 'Senha incorreta. Tente novamente.';
    case 'auth/network-request-failed':
      return 'Sem conexão. Verifique sua internet.';
    case 'permission-denied':
      return 'Permissão negada. Verifique as regras do Firestore.';
    default:
      return 'Ocorreu um erro. Tente novamente.';
  }
};

export default function AuthenticationScreen({ navigation }) {
  const [screen, setScreen] = useState('welcome');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirm, setRegisterConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [registerErrors, setRegisterErrors] = useState({});

  const { setIsLoggedIn } = useContext(AuthContext); // pega do contexto

  WebBrowser.maybeCompleteAuthSession();

  const redirectUri = makeRedirectUri({ useProxy: true });
  console.log("Redirect URI:", redirectUri);


  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "161226514717-7hcbbendck650ih3vs0mnmiumv7no0c1.apps.googleusercontent.com",
    iosClientId: '<SEU_IOS_CLIENT_ID>',
    androidClientId: '<SEU_ANDROID_CLIENT_ID>',
    webClientId: "161226514717-ub190n2sbc3s5rn9l63g1sfui8feckda.apps.googleusercontent.com",
    scopes: ['profile', 'email'],
    redirectUri,
  });

  useEffect(() => {
    if (response?.type === 'success' && response.authentication) {
      const { idToken, accessToken } = response.authentication;
      if (!idToken && !accessToken) {
        Alert.alert('Erro', 'Não foi possível obter as credenciais do Google.');
        return;
      }

      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      const signInWithGoogle = async () => {
        try {
          await signInWithCredential(auth, credential);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Erro no login com Google:', error);
          Alert.alert('Erro', 'Não foi possível fazer login com o Google. Tente novamente.');
        } finally {
          setLoading(false);
        }
      };

      signInWithGoogle();
    }
  }, [response, setIsLoggedIn]);

  const handleGoogleSignIn = async () => {
    if (!request) {
      Alert.alert('Erro', 'Não foi possível iniciar o login com Google. Tente novamente.');
      return;
    }

    setLoading(true);
    const result = await promptAsync();
    if (result.type !== 'success') {
      if (result.type === 'error') {
        Alert.alert('Erro', 'Não foi possível fazer login com o Google.');
      }
      setLoading(false);
    }
  };

  const handleLoginSubmit = async () => {
    if (!loginEmail || !loginPassword) {
      Alert.alert('Atenção', 'Preencha email e senha para entrar.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Erro no login:', error);
      const errorMessage = error.code ? getAuthErrorMessage(error.code) : (error.message || 'Erro desconhecido. Tente novamente.');
      Alert.alert('Erro no login', errorMessage);
    } finally {
      setLoading(false);
    }
  };




  const validateRegisterForm = () => {
    const errors = {};
    
    if (!registerName.trim()) {
      errors.name = 'Nome completo é obrigatório';
    }
    
    if (!registerEmail.trim()) {
      errors.email = 'Gmail é obrigatório';
    } else if (!registerEmail.includes('@')) {
      errors.email = 'Gmail inválido';
    }
    
    if (!registerPassword) {
      errors.password = 'Senha é obrigatória';
    } else if (registerPassword.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (!registerConfirm) {
      errors.confirmPassword = 'Confirme a senha';
    } else if (registerPassword !== registerConfirm) {
      errors.confirmPassword = 'As senhas não coincidem';
    }
    
    return errors;
  };

  const handleRegisterSubmit = async () => {
    const errors = validateRegisterForm();
    
    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }

    setRegisterErrors({});
    setLoading(true);
    console.log('🔵 Iniciando registro com:', { registerName, registerEmail });
    
    try {
      console.log('🟡 Criando usuário no Auth...');
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail.trim(),
        registerPassword
      );
      console.log('🟢 Usuário criado no Auth. UID:', userCredential.user.uid);

      console.log('🟡 Atualizando perfil...');
      await updateProfile(userCredential.user, {
        displayName: registerName,
      });
      console.log('🟢 Perfil atualizado.');

      console.log('🟡 Salvando no Firestore...');
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: registerName,
        email: registerEmail,
        createdAt: new Date(),
      });
      console.log('🟢 Documento salvo no Firestore!');

      Alert.alert('Sucesso', 'Conta criada com sucesso.');
      setScreen('login');
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterConfirm('');
      setRegisterErrors({});
    } catch (error) {
      console.error('🔴 Erro completo:', error);
      console.error('🔴 Código de erro:', error.code);
      console.error('🔴 Mensagem de erro:', error.message);
      const errorMessage = error.code ? getAuthErrorMessage(error.code) : (error.message || 'Erro desconhecido. Tente novamente.');

      if (error.code === 'auth/email-already-in-use') {
        setRegisterErrors({ email: errorMessage });
      } else if (error.code === 'auth/invalid-email') {
        setRegisterErrors({ email: errorMessage });
      } else {
        Alert.alert('Erro no registro', errorMessage);
      }
    } finally {
      setLoading(false);
      console.log('✅ Registro finalizado (com ou sem sucesso)');
    }
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
            email={loginEmail}
            password={loginPassword}
            onChangeEmail={setLoginEmail}
            onChangePassword={setLoginPassword}
            onSubmit={handleLoginSubmit}
            onBack={() => setScreen('welcome')}
            loading={loading}
          />
        )}

        {screen === 'register' && (
          <ScreenRegister
            name={registerName}
            email={registerEmail}
            password={registerPassword}
            confirmPassword={registerConfirm}
            onChangeName={setRegisterName}
            onChangeEmail={setRegisterEmail}
            onChangePassword={setRegisterPassword}
            onChangeConfirmPassword={setRegisterConfirm}
            onSubmit={handleRegisterSubmit}
            onBack={() => setScreen('welcome')}
            loading={loading}
            errors={registerErrors}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

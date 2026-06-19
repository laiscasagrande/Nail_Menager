import React, { useState, useContext, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';
import ScreenLogin from './ScreenLogin';
import ScreenRegister from './ScreenRegister';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import { AuthContext } from '../../context/AuthContext';
import { auth } from '../../services/firebase';
import { db } from '../../services/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
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
    case 'auth/too-many-requests':
      return 'Muitas tentativas de login. Espere alguns minutos e tente novamente.';
    case 'auth/network-request-failed':
      return 'Sem conexão. Verifique sua internet.';
    case 'permission-denied':
      return 'Permissão negada. Verifique as regras do Firestore.';
    default:
      return 'Ocorreu um erro. Tente novamente.';
  }
};

// ─── Welcome Screen (tela inicial) ───────────────────────────────────────────
function ScreenWelcome({ onLoginPress, onRegisterPress, onGoogleSignIn, loading }) {
  return (
    <View style={styles.welcomeContainer}>
      {/* Logo */}
      <View style={styles.logoWrapper}>
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* Subtítulo */}
      <Text style={styles.subtitle}>
        Sua rotina de beleza,{'\n'}organizada com perfeição
      </Text>

      {/* Divisor com lotus */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Image
          source={require('../../../assets/Lotus.icon.png')}
          style={styles.dividerLotus}
          resizeMode="contain"
        />
        <View style={styles.dividerLine} />
      </View>

      {/* Botão Entrar */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={onLoginPress}
        activeOpacity={0.85}
      >
        <Text style={styles.primaryButtonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Botão Google */}
      <TouchableOpacity
        style={styles.googleButton}
        onPress={onGoogleSignIn}
        activeOpacity={0.85}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#555" />
        ) : (
          <>
            <Image
              source={require('../../../assets/google-icon-gmail.png')}
              style={styles.googleIcon}
              resizeMode="contain"
            />
            <Text style={styles.googleButtonText}>Entrar com o Google</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Divisor ou */}
      <View style={styles.orRow}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>ou</Text>
        <View style={styles.orLine} />
      </View>

      {/* Novo por aqui */}
      <View style={styles.registerRow}>
        <Text style={styles.registerText}>É novo por aqui? 🥰 </Text>
        <TouchableOpacity onPress={onRegisterPress}>
          <Text style={styles.registerLink}>Crie sua conta!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Main Auth Screen ─────────────────────────────────────────────────────────
export default function AuthenticationScreen({ navigation }) {
  const [screen, setScreen] = useState('welcome');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirm, setRegisterConfirm] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [registerErrors, setRegisterErrors] = useState({});

  const { setIsLoggedIn } = useContext(AuthContext);

  const createOrUpdateUserDoc = async (user, extraData = {}) => {
    if (!user) return;
    await setDoc(
      doc(db, 'users', user.uid),
      {
        uid: user.uid,
        email: user.email || '',
        name: user.displayName || '',
        ...extraData,
      },
      { merge: true }
    );
  };

  WebBrowser.maybeCompleteAuthSession();

  // Detect if we're running inside Expo Go (proxy) or as a native standalone/APK
  const isExpoGo = Constants.appOwnership === 'expo';
  const useProxy = isExpoGo; // true for Expo Go, false for native APK

  const redirectUri = makeRedirectUri({ useProxy, native: !useProxy });

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '161226514717-7hcbbendck650ih3vs0mnmiumv7no0c1.apps.googleusercontent.com',
    iosClientId: '...',
    androidClientId: '161226514717-4ndrfut0ohsolmp6cj6ijohndsqpjpoe.apps.googleusercontent.com',
    webClientId: '161226514717-ub190n2sbc3s5rn9l63g1sfui8feckda.apps.googleusercontent.com',
    scopes: ['openid', 'profile', 'email'],
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
          await createOrUpdateUserDoc(auth.currentUser, { lastLoginAt: new Date() });
          setIsLoggedIn(true);
        } catch (error) {
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
    const result = await promptAsync({ useProxy });
    if (result.type !== 'success') {
      if (result.type === 'error') Alert.alert('Erro', 'Não foi possível fazer login com o Google.');
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
      const msg = error.code ? getAuthErrorMessage(error.code) : error.message || 'Erro desconhecido.';
      Alert.alert('Erro no login', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordPress = () => {
    setResetEmail(loginEmail.trim());
    setScreen('forgotPassword');
  };

  const handleResetPasswordSubmit = async () => {
    const email = resetEmail.trim();
    if (!email) {
      Alert.alert('Atenção', 'Digite o Gmail usado para recuperar a conta.');
      return;
    }
    setLoading(true);
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (!methods || methods.length === 0) {
        Alert.alert('Atenção', 'Email não cadastrado. Verifique ou crie uma nova conta.');
        return;
      }
      if (methods.includes('google.com') && !methods.includes('password')) {
        Alert.alert('Conta Google', 'Esta conta foi criada com o Google. Use o botão Entrar com o Google.');
        setScreen('welcome');
        return;
      }
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Email enviado', 'Verifique sua caixa de entrada do Gmail.');
      setResetEmail('');
      setScreen('login');
    } catch (error) {
      const msg = error.code ? getAuthErrorMessage(error.code) : error.message || 'Erro.';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  const validateRegisterForm = () => {
    const errors = {};
    if (!registerName.trim()) errors.name = 'Nome completo é obrigatório';
    if (!registerEmail.trim()) errors.email = 'Gmail é obrigatório';
    else if (!registerEmail.includes('@')) errors.email = 'Gmail inválido';
    if (!registerPassword) errors.password = 'Senha é obrigatória';
    else if (registerPassword.length < 6) errors.password = 'Senha deve ter pelo menos 6 caracteres';
    if (!registerConfirm) errors.confirmPassword = 'Confirme a senha';
    else if (registerPassword !== registerConfirm) errors.confirmPassword = 'As senhas não coincidem';
    return errors;
  };

  const handleRegisterSubmit = async () => {
    const errors = validateRegisterForm();
    if (Object.keys(errors).length > 0) { setRegisterErrors(errors); return; }
    setRegisterErrors({});
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail.trim(), registerPassword);
      await updateProfile(userCredential.user, { displayName: registerName });
      await createOrUpdateUserDoc(userCredential.user, {
        name: registerName,
        email: registerEmail.trim(),
        createdAt: new Date(),
      });
      Alert.alert('Sucesso', 'Conta criada com sucesso.');
      setScreen('login');
      setRegisterName(''); setRegisterEmail(''); setRegisterPassword(''); setRegisterConfirm(''); setRegisterErrors({});
    } catch (error) {
      const msg = error.code ? getAuthErrorMessage(error.code) : error.message || 'Erro desconhecido.';
      if (error.code === 'auth/email-already-in-use' || error.code === 'auth/invalid-email') {
        setRegisterErrors({ email: msg });
      } else {
        Alert.alert('Erro no registro', msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <RNStatusBar barStyle="dark-content" backgroundColor="#F8D7E7" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Fundo com flores decorativas nos cantos */}
        <ImageBackground
          source={require('../../../assets/LotusShadow.png')}
          style={styles.backgroundImage}
          imageStyle={styles.backgroundImageStyle}
        >
          {screen === 'welcome' && (
            <ScreenWelcome
              onLoginPress={() => setScreen('login')}
              onRegisterPress={() => setScreen('register')}
              onGoogleSignIn={handleGoogleSignIn}
              loading={loading}
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
              onForgotPassword={handleForgotPasswordPress}
              loading={loading}
            />
          )}

          {screen === 'forgotPassword' && (
            <ForgotPasswordScreen
              email={resetEmail}
              onChangeEmail={setResetEmail}
              onSubmit={handleResetPasswordSubmit}
              onBack={() => setScreen('login')}
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
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const PINK_PRIMARY = '#E91E8C';   // rosa forte (botão Entrar)
const PINK_LIGHT = '#F8D7E7';    // fundo rosa claro
const PINK_MID = '#F48FB1';      // rosa médio (divisores)
const TEXT_DARK = '#3D2C35';     // texto escuro
const TEXT_MID = '#7B5E6A';      // texto secundário

const styles = StyleSheet.create({
  // ── Layout base ──
  container: {
    flex: 1,
    backgroundColor: PINK_LIGHT,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
    minHeight: '100%',
  },
  backgroundImageStyle: {
    opacity: 0.18,
    resizeMode: 'cover',
  },

  // ── Welcome container ──
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 48,
  },

  // ── Logo ──
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  lotusIcon: {
    width: 52,
    height: 52,
    marginBottom: 6,
  },
  logoImage: {
    width: 220,
    height: 80,
  },

  // ── Subtítulo ──
  subtitle: {
    fontSize: 16,
    color: TEXT_DARK,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
    marginBottom: 22,
    letterSpacing: 0.2,
  },

  // ── Divisor com lotus ──
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    width: '70%',
  },
  dividerLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: PINK_MID,
    opacity: 0.7,
  },
  dividerLotus: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
    tintColor: PINK_PRIMARY,
  },

  // ── Botão primário (Entrar) ──
  primaryButton: {
    width: '100%',
    backgroundColor: PINK_PRIMARY,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: PINK_PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // ── Botão Google ──
  googleButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 13,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E0C8D4',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    color: TEXT_DARK,
    fontSize: 15,
    fontWeight: '500',
  },

  // ── Divisor "ou" ──
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 18,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: PINK_MID,
    opacity: 0.5,
  },
  orText: {
    marginHorizontal: 12,
    color: TEXT_MID,
    fontSize: 14,
    fontWeight: '400',
  },

  // ── Registro ──
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerText: {
    color: TEXT_MID,
    fontSize: 14,
  },
  registerLink: {
    color: PINK_PRIMARY,
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
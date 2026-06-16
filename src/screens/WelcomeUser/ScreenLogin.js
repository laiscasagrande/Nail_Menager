import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { User, Lock } from 'lucide-react-native';

const PINK_PRIMARY = '#E91E8C';
const PINK_LIGHT   = '#F8D7E7';
const TEXT_DARK    = '#3D2C35';
const TEXT_MID     = '#7B5E6A';
const INPUT_BG     = '#FFFFFF';
const BORDER_COLOR = '#EDD5E3';

export default function ScreenLogin({
  email,
  password,
  onChangeEmail,
  onChangePassword,
  onSubmit,
  onBack,
  onForgotPassword,
  loading,
}) {
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused,  setPassFocused]  = useState(false);

  return (
    <View style={styles.container}>
      {/* ── Logo ── */}
      <View style={styles.logoWrapper}>
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* ── Campos ── */}
      <View style={styles.fieldsWrapper}>
        {/* Email / Usuário */}
        <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
          <User size={20} color={emailFocused ? PINK_PRIMARY : '#C4A0B5'} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Usuário"
            placeholderTextColor="#C4A0B5"
            value={email}
            onChangeText={onChangeEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </View>

        {/* Senha */}
        <View style={[styles.inputWrapper, passFocused && styles.inputWrapperFocused]}>
          <Lock size={20} color={passFocused ? PINK_PRIMARY : '#C4A0B5'} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#C4A0B5"
            secureTextEntry
            value={password}
            onChangeText={onChangePassword}
            onFocus={() => setPassFocused(true)}
            onBlur={() => setPassFocused(false)}
          />
        </View>
      </View>

      {/* ── Botão Entrar ── */}
      <TouchableOpacity
        style={[styles.primaryButton, loading && { opacity: 0.65 }]}
        onPress={onSubmit}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.primaryButtonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      {/* ── Links ── */}
      <TouchableOpacity style={styles.linkBtn} onPress={onForgotPassword}>
        <Text style={styles.linkText}>Esqueci minha senha</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkBtn} onPress={onBack}>
        <Text style={[styles.linkText, styles.backLink]}>← Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 56,
    paddingBottom: 48,
  },

  // ── Logo ──
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 40,
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

  // ── Campos ──
  fieldsWrapper: {
    width: '100%',
    marginBottom: 24,
    gap: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INPUT_BG,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 14,
    paddingVertical: 13,
    shadowColor: '#C4A0B5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputWrapperFocused: {
    borderColor: PINK_PRIMARY,
    shadowOpacity: 0.2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: TEXT_DARK,
    paddingVertical: 0,
  },

  // ── Botão primário ──
  primaryButton: {
    width: '100%',
    backgroundColor: PINK_PRIMARY,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
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

  // ── Links ──
  linkBtn: {
    paddingVertical: 6,
  },
  linkText: {
    color: PINK_PRIMARY,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  backLink: {
    color: TEXT_MID,
    fontWeight: '400',
    textDecorationLine: 'none',
    marginTop: 4,
  },
});
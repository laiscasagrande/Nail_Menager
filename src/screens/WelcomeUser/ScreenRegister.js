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
import { User, Lock, Mail } from 'lucide-react-native';

const PINK_PRIMARY = '#E91E8C';
const TEXT_DARK    = '#3D2C35';
const TEXT_MID     = '#7B5E6A';
const INPUT_BG     = '#FFFFFF';
const BORDER_COLOR = '#EDD5E3';
const ERROR_COLOR  = '#e74c3c';

function InputField({ icon, placeholder, value, onChangeText, secureTextEntry, keyboardType, autoCapitalize, error }) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldBlock}>
      <View style={[styles.inputWrapper, focused && styles.inputWrapperFocused, error && styles.inputWrapperError]}>
        <View style={styles.icon}>{icon(focused)}</View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#C4A0B5"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? 'sentences'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export default function ScreenRegister({
  name, email, password, confirmPassword,
  onChangeName, onChangeEmail, onChangePassword, onChangeConfirmPassword,
  onSubmit, onBack, loading, errors = {},
}) {
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
        <InputField
          icon={(f) => <User size={20} color={f ? PINK_PRIMARY : '#C4A0B5'} />}
          placeholder="Nome completo"
          value={name}
          onChangeText={onChangeName}
          error={errors.name}
        />
        <InputField
          icon={(f) => <Mail size={20} color={f ? PINK_PRIMARY : '#C4A0B5'} />}
          placeholder="Gmail"
          value={email}
          onChangeText={onChangeEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />
        <InputField
          icon={(f) => <Lock size={20} color={f ? PINK_PRIMARY : '#C4A0B5'} />}
          placeholder="Senha"
          value={password}
          onChangeText={onChangePassword}
          secureTextEntry
          autoCapitalize="none"
          error={errors.password}
        />
        <InputField
          icon={(f) => <Lock size={20} color={f ? PINK_PRIMARY : '#C4A0B5'} />}
          placeholder="Confirme a senha"
          value={confirmPassword}
          onChangeText={onChangeConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          error={errors.confirmPassword}
        />
      </View>

      {/* ── Botão Cadastrar ── */}
      <TouchableOpacity
        style={[styles.primaryButton, loading && { opacity: 0.65 }]}
        onPress={onSubmit}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.primaryButtonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>

      {/* ── Voltar ── */}
      <TouchableOpacity style={styles.linkBtn} onPress={onBack}>
        <Text style={styles.backLink}>← Voltar</Text>
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
    marginBottom: 32,
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
    gap: 12,
  },
  fieldBlock: {
    width: '100%',
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
  inputWrapperError: {
    borderColor: ERROR_COLOR,
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
  errorText: {
    color: ERROR_COLOR,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },

  // ── Botão ──
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
  backLink: {
    color: TEXT_MID,
    fontSize: 14,
    textAlign: 'center',
  },
});
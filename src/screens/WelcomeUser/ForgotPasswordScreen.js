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
import { Mail } from 'lucide-react-native';

const PINK_PRIMARY = '#E91E8C';
const PINK_MID     = '#F48FB1';
const TEXT_DARK    = '#3D2C35';
const TEXT_MID     = '#7B5E6A';
const INPUT_BG     = '#FFFFFF';
const BORDER_COLOR = '#EDD5E3';

export default function ForgotPasswordScreen({ email, onChangeEmail, onSubmit, onBack, loading }) {
  const [focused, setFocused] = useState(false);

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

      {/* ── Título e descrição ── */}
      <Text style={styles.title}>Recuperar senha</Text>
      <Text style={styles.description}>
        Informe o Gmail cadastrado. Se sua conta foi criada com o Google, use o botão{' '}
        <Text style={styles.descriptionBold}>Entrar com o Google</Text>.
      </Text>

      {/* ── Divisor decorativo ── */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Image
          source={require('../../../assets/Lotus.icon.png')}
          style={styles.dividerLotus}
          resizeMode="contain"
        />
        <View style={styles.dividerLine} />
      </View>

      {/* ── Campo de email ── */}
      <View style={styles.fieldsWrapper}>
        <View style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}>
          <Mail size={20} color={focused ? PINK_PRIMARY : '#C4A0B5'} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Gmail"
            placeholderTextColor="#C4A0B5"
            value={email}
            onChangeText={onChangeEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </View>
      </View>

      {/* ── Botão enviar ── */}
      <TouchableOpacity
        style={[styles.primaryButton, loading && { opacity: 0.65 }]}
        onPress={onSubmit}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.primaryButtonText}>Enviar link de recuperação</Text>
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
    marginBottom: 28,
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

  // ── Texto ──
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: TEXT_MID,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  descriptionBold: {
    fontWeight: '700',
    color: PINK_PRIMARY,
  },

  // ── Divisor ──
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
    marginBottom: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: PINK_MID,
    opacity: 0.6,
  },
  dividerLotus: {
    width: 22,
    height: 22,
    marginHorizontal: 10,
    tintColor: PINK_PRIMARY,
  },

  // ── Campo ──
  fieldsWrapper: {
    width: '100%',
    marginBottom: 24,
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
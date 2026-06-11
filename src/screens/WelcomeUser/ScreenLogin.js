import React from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../../constants/styles';

export default function ScreenLogin({ email, password, onChangeEmail, onChangePassword, onSubmit, onBack, onForgotPassword, loading }) {
  return (
    <View style={styles.card}>
      <Text style={styles.brandTitle}>Nail</Text>
      <Text style={styles.brandSubtitle}>Manager</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Gmail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={onChangeEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={onChangePassword}
        />
      </View>

      <TouchableOpacity style={[styles.primaryButton, loading && { opacity: 0.6 }]} onPress={onSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.primaryButtonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryLink} onPress={onForgotPassword}>
        <Text style={styles.secondaryLinkText}>Esqueci a minha senha</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryLink} onPress={onBack}>
        <Text style={styles.secondaryLinkText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

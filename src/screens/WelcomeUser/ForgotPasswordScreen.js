import React from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../../constants/styles';

export default function ForgotPasswordScreen({ email, onChangeEmail, onSubmit, onBack, loading }) {
  return (
    <View style={styles.card}>
      <Text style={styles.brandTitle}>Recuperar senha</Text>
      <Text style={styles.brandSubtitle}>Nail Manager</Text>
      <Text style={styles.description}>
        Informe o Gmail usado no cadastro. Se a conta foi criada com Google, você deve entrar usando o login do Google.
      </Text>

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

      <TouchableOpacity style={[styles.primaryButton, loading && { opacity: 0.6 }]} onPress={onSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.primaryButtonText}>Enviar código / link</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryLink} onPress={onBack}>
        <Text style={styles.secondaryLinkText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

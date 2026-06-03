import React from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../constants/styles';

export default function ScreenRegister({ name, email, password, confirmPassword, onChangeName, onChangeEmail, onChangePassword, onChangeConfirmPassword, onSubmit, onBack, loading, errors = {} }) {
  return (
    <View style={styles.card}>
      <Text style={styles.brandTitle}>Nail</Text>
      <Text style={styles.brandSubtitle}>Manager</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, errors.name && { borderColor: '#e74c3c', borderWidth: 1 }]}
          placeholder="Nome completo"
          placeholderTextColor="#999"
          value={name}
          onChangeText={onChangeName}
        />
        {errors.name && <Text style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>{errors.name}</Text>}
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, errors.email && { borderColor: '#e74c3c', borderWidth: 1 }]}
          placeholder="Gmail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={onChangeEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {errors.email && <Text style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>{errors.email}</Text>}
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, errors.password && { borderColor: '#e74c3c', borderWidth: 1 }]}
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={onChangePassword}
        />
        {errors.password && <Text style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>{errors.password}</Text>}
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, errors.confirmPassword && { borderColor: '#e74c3c', borderWidth: 1 }]}
          placeholder="Confirme a senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={onChangeConfirmPassword}
        />
        {errors.confirmPassword && <Text style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>{errors.confirmPassword}</Text>}
      </View>

      <TouchableOpacity style={[styles.primaryButton, loading && { opacity: 0.6 }]} onPress={onSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.primaryButtonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryLink} onPress={onBack}>
        <Text style={styles.secondaryLinkText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

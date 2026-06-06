import React from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../styles';

export default function AccountScreen({
  name,
  email,
  currentPassword,
  newPassword,
  confirmPassword,
  loading,
  onChangeName,
  onChangeEmail,
  onChangeCurrentPassword,
  onChangeNewPassword,
  onChangeConfirmPassword,
  onSubmit,
}) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Editar conta</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#999"
        value={name}
        onChangeText={onChangeName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={onChangeEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha atual (para atualizar email/senha)"
        placeholderTextColor="#999"
        secureTextEntry
        value={currentPassword}
        onChangeText={onChangeCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Nova senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={newPassword}
        onChangeText={onChangeNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirme nova senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={confirmPassword}
        onChangeText={onChangeConfirmPassword}
      />
      <TouchableOpacity style={styles.saveButton} onPress={onSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Salvar alterações</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

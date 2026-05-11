import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../constants/styles';

export default function TelaLogin({ user, password, onChangeUser, onChangePassword, onSubmit, onBack }) {
  return (
    <View style={styles.card}>
      <Text style={styles.brandTitle}>Nail</Text>
      <Text style={styles.brandSubtitle}>Manager</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Usuário"
          placeholderTextColor="#999"
          value={user}
          onChangeText={onChangeUser}
          autoCapitalize="none"
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

      <TouchableOpacity style={styles.primaryButton} onPress={onSubmit}>
        <Text style={styles.primaryButtonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryLink} onPress={onBack}>
        <Text style={styles.secondaryLinkText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../constants/styles';

export default function TelaCadastro({ name, password, confirmPassword, onChangeName, onChangePassword, onChangeConfirmPassword, onSubmit, onBack }) {
  return (
    <View style={styles.card}>
      <Text style={styles.brandTitle}>Nail</Text>
      <Text style={styles.brandSubtitle}>Manager</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor="#999"
          value={name}
          onChangeText={onChangeName}
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
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Confirme a senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={onChangeConfirmPassword}
        />
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onSubmit}>
        <Text style={styles.primaryButtonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryLink} onPress={onBack}>
        <Text style={styles.secondaryLinkText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

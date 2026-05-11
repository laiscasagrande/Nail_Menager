import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../constants/styles';

export default function TelaBoasVindas({ onLoginPress, onRegisterPress, onGoogleSignIn }) {
  return (
    <View style={styles.card}>
      <Text style={styles.brandTitle}>Nail</Text>
      <Text style={styles.brandSubtitle}>Manager</Text>
      <Text style={styles.description}>Sua rotina de beleza, organizada com perfeição</Text>

      <TouchableOpacity style={styles.primaryButton} onPress={onLoginPress}>
        <Text style={styles.primaryButtonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} onPress={onGoogleSignIn}>
        <Text style={styles.googleButtonText}>Entrar com o Google</Text>
      </TouchableOpacity>

      <View style={styles.orRow}>
        <View style={styles.line} />
        <Text style={styles.orText}>ou</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity onPress={onRegisterPress}>
        <Text style={styles.footerLink}>É novo por aqui? Crie sua conta!</Text>
      </TouchableOpacity>
    </View>
  );
}

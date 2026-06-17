import React from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import styles from '../../constants/styles';

export default function ScreenWelcome({ onLoginPress, onRegisterPress, onGoogleSignIn }) {
  return (
    <View style={styles.card}>
      <Text style={styles.descriptionStrong}>Sua rotina de beleza, organizada com perfeição.</Text>

      <TouchableOpacity style={styles.primaryButton} onPress={onLoginPress}>
        <Text style={styles.primaryButtonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} onPress={onGoogleSignIn}>
        <Image source={require('../../../assets/google (1) 1.png')} style={styles.googleIcon} />
        <Text style={styles.googleButtonText}>Entrar com o Google</Text>
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Image source={require('../../../assets/Lotus.icon.png')} style={styles.dividerLotus} />
        <View style={styles.dividerLine} />
      </View>
      <Text style={styles.description}>É novo por aqui?🥰</Text>
      <TouchableOpacity onPress={onRegisterPress}>
        <Text style={styles.footerLink}>Crie sua conta!</Text>
      </TouchableOpacity>
    </View>
  );
}

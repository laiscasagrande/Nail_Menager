import React from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native';

export default function ScheduleScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendamentos</Text>
      <Text style={styles.subtitle}>Sua tela de agendamentos será exibida aqui</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8D7E7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D6336C',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#9C1F54',
  },
});

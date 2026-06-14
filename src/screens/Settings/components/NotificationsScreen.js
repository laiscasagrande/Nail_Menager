import React from 'react';
import { Switch, Text, View } from 'react-native';
import { Bell } from 'lucide-react-native';
import { COLORS } from '../../../constants/colors';
import styles from '../styles';

export default function NotificationsScreen({ notifications, onToggle }) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Notificações</Text>
      <View style={styles.notificationRow}>
        <View style={styles.notificationText}>
          <Text style={styles.notificationTitle}>Lembretes</Text>
          <Text style={styles.notificationSubtitle}>Receba avisos de novos horários.</Text>
        </View>
        <Switch
          value={notifications.reminders}
          onValueChange={() => onToggle('reminders')}
          thumbColor={notifications.reminders ? COLORS.primary : '#fff'}
          trackColor={{ false: '#c4c4c4', true: '#FFB6D3' }}
        />
      </View>
      <View style={styles.notificationRow}>
        <View style={styles.notificationText}>
          <Text style={styles.notificationTitle}>Novidades</Text>
          <Text style={styles.notificationSubtitle}>Receba atualizações e ofertas.</Text>
        </View>
        <Switch
          value={notifications.promotions}
          onValueChange={() => onToggle('promotions')}
          thumbColor={notifications.promotions ? COLORS.primary : '#fff'}
          trackColor={{ false: '#c4c4c4', true: '#FFB6D3' }}
        />
      </View>
    </View>
  );
}

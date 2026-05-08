import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

function takeInitials(completeName = '') {
  const parts = completeName.trim().split(/\s+/).filter(Boolean);
  const firstInitial = parts[0]?.[0] ?? '';
  const lastInitial = parts[1]?.[0] ?? '';
  return (firstInitial + lastInitial).toUpperCase();
}

export default function BillingCard({ item }) {
  if (!item) return null;

  const initials = takeInitials(item.clientName);
  const formattedAmount = Number.isFinite(item.amount)
    ? item.amount.toFixed(2).replace('.', ',')
    : null;

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarTexto}>{initials}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.nomeCliente}>{item.clientName}</Text>
        <View style={styles.dataLinha}>
          <Text style={styles.dataIcone}>📅</Text>
          <Text style={styles.dataTexto}>{item.date}</Text>
        </View>
        <View style={styles.dataLinha}>
          <Text style={styles.dataIcone}>📅</Text>
          <Text style={styles.dataTexto}>{item.description}</Text>
          {formattedAmount ? (
            <Text style={styles.valor}>{formattedAmount}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FCE4EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTexto: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  cardInfo: {
    flex: 1,
  },
  nomeCliente: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  dataLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  dataIcone: {
    fontSize: 12,
  },
  dataTexto: {
    flex: 1,
    fontSize: 12,
    color: '#888',
  },
  valor: {
    marginLeft: 'auto',
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
  },
});
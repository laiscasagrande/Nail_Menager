import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import BillingCardComponent from '../components/BillingCard';


const Billing = [
    {
        id: '1',
        clientName: 'Maria Souza',
        date: '2024-06-01',
        amount: 150.00,
        description: 'Faturamento do dia 01/06/2024',
    },
    {
        id: '2',
        clientName: 'Mikaela Pera',
        date: '2024-06-02',
        amount: 200.00,
        description: 'Faturamento do dia 02/06/2024',
    },
    {
        id: '3',
        clientName: 'Maisha Fernandes',
        date: '2024-06-03',
        amount: 180.00,
        description: 'Faturamento do dia 03/06/2024',
    },
];

export default function BillingScreen() {
    return (
        <View style={styles.container}>
            <FlatList
                data={Billing}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <BillingCardComponent item={item} />}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
    listContent: {
    padding: 12,
        gap: 12,
  },
});
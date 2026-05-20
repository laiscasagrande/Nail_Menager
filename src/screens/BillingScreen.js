import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import BillingCardComponent from '../components/BillingCard';

// Dados de exemplo para faturamento
const Billing = [
    {
        id: '1',
        clientName: 'Maria Souza',
        date: '2024-06-01',
        status: 'Pago',
        amount: 150.00,
        description: 'Faturamento do dia 01/06/2024',
    },
    {
        id: '2',
        clientName: 'Mikaela Pera',
        date: '2024-06-02',
        status: 'Pendente',
        amount: 200.00,
        description: 'Faturamento do dia 02/06/2024',
    },
    {
        id: '3',
        clientName: 'Maisha Fernandes',
        date: '2024-06-03',
        status: 'Pago',
        amount: 180.00,
        description: 'Faturamento do dia 03/06/2024',
    },
];

// Função para filtrar os pagamentos do mês atual
const PaymentFilter = (Billing, mes) => {
    return Billing.filter((item) => {
        return item.status === 'Pago' && new Date(item.date).getMonth() === mes;
    }); 
};

// Meses no JS sao baseados em 0 (0 = janeiro, 5 = junho)
const currentMonth = 5;
const filteredBilling = PaymentFilter(Billing, currentMonth);

export default function BillingScreen() {
    return (
        <View style={styles.container}>
            <FlatList
                data={filteredBilling}
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
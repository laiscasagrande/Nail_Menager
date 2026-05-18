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

// Agrupar os pagamentos por dia
const GroupByDay = {};
PaymentFilter(Billing, 5).forEach((item)  => {
    if (!GroupByDay[item.date]) {
        GroupByDay[item.date] = 0
    }
    GroupByDay[item.date] += item.amount;
});

// Calcular o total de faturamento do mês atual
const PaymentBilling = PaymentFilter(Billing, 5).reduce((acumulator, currentValue) => {
    return acumulator + currentValue.amount;
}, 0);  

export default function BillingScreen() {
    return (
        <View style={styles.container}>
            <FlatList
                data={Object.entries(GroupByDay)}
                keyExtractor={(item) => item[0]}
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
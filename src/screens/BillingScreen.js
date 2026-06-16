import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
 
const screenWidth = Dimensions.get('window').width;
 
const STATUS_CONFIG = {
  completed: {
    label: 'Concluído',
    color: '#4CAF50',
    legendFontColor: '#555',
  },
  scheduled: {
    label: 'Agendado',
    color: '#2196F3',
    legendFontColor: '#555',
  },
  cancelled: {
    label: 'Cancelado',
    color: '#F44336',
    legendFontColor: '#555',
  },
  pending: {
    label: 'Pendente',
    color: '#FF9800',
    legendFontColor: '#555',
  },
  unknown: {
    label: 'Outros',
    color: '#9E9E9E',
    legendFontColor: '#555',
  },
};
 

const MONTHS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];
 
export default function FaturamentoTela() {
  const { theme } = useTheme();

  const [appointments, setAppointments] = useState([]); 
  const [loading, setLoading] = useState(true);          
 

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());     
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
 
  
  useFocusEffect(
    useCallback(() => {
      async function fetchAppointments() {
        setLoading(true);
        try {
          const snapshot = await getDocs(collection(db, 'scheduling'));

          const list = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setAppointments(list);
          console.log(list[0]);
        } catch (error) {
          console.error('Error fetching appointments:', error);
        } finally {
          setLoading(false);
        }
      }

      fetchAppointments();
    }, [])
  ); 

  const appointmentsInMonth = appointments.filter((item) => {
    if (!item.start) return false; 
    const date = item.start.toDate(); 
    return (
      date.getMonth() === selectedMonth &&
      date.getFullYear() === selectedYear
    );
  });
 

  const completedAppointments = appointmentsInMonth.filter(
    (item) => item.status === 'completed'
  );
  const pendingAppointments = appointmentsInMonth.filter(
    (item) => item.status === 'pending'
  );
  const cancelledAppointments = appointmentsInMonth.filter(
    (item) => item.status === 'cancelled'
  );
 


  const totalRevenue = completedAppointments.reduce(
    (sum, item) => sum + Number(item.servicePrice || 0),
    0 
  );

  function buildPieData() {

    const counter = {};
 
    appointmentsInMonth.forEach((item) => {
      const status = item.status || 'unknown';
      if (!counter[status]) counter[status] = 0;
      counter[status]++;
    });

    return Object.keys(counter).map((status) => {
      const config = STATUS_CONFIG[status] || STATUS_CONFIG.unknown;
      return {
        name: config.label,
        population: counter[status],
        color: config.color,
        legendFontColor: theme?.subtitle || config.legendFontColor,
        legendFontSize: 13,
      };
    });
  }

    const pieData = buildPieData();
        function goToPreviousMonth() {
            if (selectedMonth === 0) {
                setSelectedYear(selectedYear - 1);
                setSelectedMonth(11);
            } else {
                setSelectedMonth(selectedMonth - 1);
            }
        }
        function goToNextMonth() {
            if (selectedMonth === 11) {
                setSelectedYear(selectedYear + 1);
                setSelectedMonth(0);
            } else {
                setSelectedMonth(selectedMonth + 1);
            }
        }

  function formatDate(timestamp) {
    if (!timestamp) return '-';
    const date = timestamp.toDate();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function formatCurrency(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return 'R$ 0,00';
    }

    const fixed = numericValue.toFixed(2);
    const parts = fixed.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `R$ ${integerPart},${parts[1]}`;
  }

  if (loading) {
        return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}> 
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.subtitle }]}>Carregando faturamento...</Text>
      </View>
    );
  }

  function renderItem({ item }) {
    const clientLabel = item.clientName || item.client || 'Cliente Desconhecido';
    const serviceLabel = item.serviceName || item.service || 'Serviço Desconhecido';

    return (
      <View style={[styles.appointmentCard, { backgroundColor: theme.card }]}> 
        <View style={styles.appointmentRow}>
          <Text style={[styles.appointmentPrimaryText, { color: theme.text }]}>{clientLabel}</Text>
          <Text style={[styles.appointmentValue, { color: theme.primary }]}>{formatCurrency(item.servicePrice)}</Text>
        </View>
        <View style={styles.appointmentRow}>
          <Text style={[styles.appointmentSecondaryText, { color: theme.subtitle }]}>{serviceLabel}</Text>
          <Text style={[styles.appointmentDate, { color: theme.subtitle }]}>{formatDate(item.start)}</Text>
        </View>
      </View>
    );
  }

  function renderSection(title, data) {
    return (
      <>
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>{title}</Text>
        {data.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.subtitle }]}>Nenhum registro neste período</Text>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        )}
      </>
    );
  }

  return (
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>

        <Text style={[styles.title, { color: theme.text }]}>Faturamento</Text>

         <View style={styles.monthSelector}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.arrowButton}>
          <Text style={[styles.arrowText, { color: theme.primary }]}>{'‹'}</Text>
        </TouchableOpacity>
 
        <Text style={[styles.monthText, { color: theme.text }]}> 
          {MONTHS[selectedMonth]} {selectedYear}
        </Text>
 
        <TouchableOpacity onPress={goToNextMonth} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'›'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardRow}>
        <View style={[styles.card, styles.highlightCard]}>
              <Text style={[styles.cardTitle, { color: '#FFF' }]}>Total Faturado</Text>
              <Text style={styles.cardValue}>{formatCurrency(totalRevenue)}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}> 
          <Text style={[styles.cardLabel, { color: theme.subtitle }]}>Total do Mês</Text>
          <Text style={[styles.cardNumber, { color: theme.text }]}>{appointmentsInMonth.length}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}> 
          <Text style={[styles.cardLabel, { color: theme.subtitle }]}>Ticket Médio</Text>
          <Text style={[styles.cardNumber, { color: theme.text }]}> 
            {formatCurrency(
              completedAppointments.length === 0
                ? 0
                : totalRevenue / completedAppointments.length
            )}
          </Text>
        </View>
      </View>

        <Text style={[styles.sectionTitle, { color: theme.primary }]}>Status dos Agendamentos</Text>

        {pieData.length > 0 ? (
          <View style={{ alignItems: 'center' }}>
            <PieChart
              data={pieData}
              width={Math.min(screenWidth - 32, 360)}
              height={220}
              chartConfig={{
                color: () => theme.text,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        ) : (
          <Text style={styles.noDataText}>Nenhum agendamento para este mês</Text>
        )}

            {renderSection('✅ Concluídos', completedAppointments)}
            {renderSection('⏳ Pendentes', pendingAppointments)}
            {renderSection('❌ Cancelados', cancelledAppointments)}
    </ScrollView>
  );
 }


 const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#888',
    fontSize: 14,
  },
 

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
  },
 
  
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 16,
  },
  arrowButton: {
    padding: 8,
  },
  arrowText: {
    fontSize: 28,
    color: '#E91E8C',
    lineHeight: 30,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    minWidth: 110,
    textAlign: 'center',
  },
 
  cardRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  highlightCard: {
    flex: 1.4,
    backgroundColor: '#E91E8C',
  },
  cardLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold', 
    color: '#FFF',
  },
  cardNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
 

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
 
  
  emptyText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
  },

  appointmentCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  appointmentPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    flex: 1,
  },
  appointmentSecondaryText: {
    fontSize: 13,
    color: '#888',
    flex: 1,
  },
  appointmentValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
    marginLeft: 8,
  },
  appointmentDate: {
    fontSize: 13,
    color: '#888',
    marginLeft: 8,
  },
});
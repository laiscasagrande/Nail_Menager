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
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { CLIENTS } from './SchedulingScreen/hooks/useScheduling';
import colors, { COLORS } from '../constants/colors';
 
const screenWidth = Dimensions.get('window').width;
 
const STATUS_CONFIG = {
  completed: {
    label: 'Concluído',
    color: COLORS.primary,
    legendFontColor: colors.text,
  },
  scheduled: {
    label: 'Agendado',
    color: colors.accent,
    legendFontColor: colors.text,
  },
  cancelled: {
    label: 'Cancelado',
    color: colors.primaryDark,
    legendFontColor: colors.text,
  },
  pending: {
    label: 'Pendente',
    color: '#F4B6D5',
    legendFontColor: colors.text,
  },
  unknown: {
    label: 'Outros',
    color: colors.textMuted,
    legendFontColor: colors.text,
  },
};

const CLIENT_NAME_BY_VALUE = CLIENTS.reduce((accumulator, client) => {
  accumulator[client.value] = client.label;
  return accumulator;
}, {});
 

const MONTHS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];
 
export default function FaturamentoTela() {

  const [appointments, setAppointments] = useState([]); 
  const [clientNames, setClientNames] = useState({});
  const [serviceNames, setServiceNames] = useState({});
  const [loading, setLoading] = useState(true);          
 

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());     
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
 
  
  useFocusEffect(
    useCallback(() => {
      async function fetchAppointments() {
        setLoading(true);
        try {
          const [snapshot, clientsSnapshot, servicesSnapshot] = await Promise.all([
            getDocs(collection(db, 'scheduling')),
            getDocs(collection(db, 'clients')),
            getDocs(collection(db, 'services')),
          ]);

          const list = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const namesById = clientsSnapshot.docs.reduce((accumulator, docSnapshot) => {
            const data = docSnapshot.data();
            const clientName = data.name || data.clientName || data.label || docSnapshot.id;

            accumulator[docSnapshot.id] = clientName;

            if (data.name) {
              accumulator[data.name] = data.name;
            }

            return accumulator;
          }, {});

          const serviceNamesById = servicesSnapshot.docs.reduce((accumulator, docSnapshot) => {
            const data = docSnapshot.data();
            const serviceName = data.procedure || data.serviceName || data.name || data.label || docSnapshot.id;

            accumulator[docSnapshot.id] = serviceName;

            if (data.procedure) {
              accumulator[data.procedure] = data.procedure;
            }

            return accumulator;
          }, {});

          setClientNames({
            ...CLIENT_NAME_BY_VALUE,
            ...namesById,
          });

          setServiceNames(serviceNamesById);

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
            legendFontColor: config.legendFontColor,
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

  function getClientLabel(item) {
    return (
      item.clientName ||
      item.title ||
      clientNames[item.client] ||
      item.client ||
      'Cliente Desconhecido'
    );
  }

  function getServiceLabel(item) {
    return (
      item.serviceName ||
      serviceNames[item.service] ||
      item.service ||
      'Serviço Desconhecido'
    );
  }

  if (loading) {
        return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando faturamento...</Text>
      </View>
    );
  }

  function renderItem({ item }) {
    const clientLabel = getClientLabel(item);
    const serviceLabel = getServiceLabel(item);

    return (
      <View style={styles.appointmentCard}>
        <View style={styles.appointmentRow}>
          <Text style={styles.appointmentPrimaryText}>{clientLabel}</Text>
          <Text style={styles.appointmentValue}>{formatCurrency(item.servicePrice)}</Text>
        </View>
        <View style={styles.appointmentRow}>
          <Text style={styles.appointmentSecondaryText}>{serviceLabel}</Text>
          <Text style={styles.appointmentDate}>{formatDate(item.start)}</Text>
        </View>
      </View>
    );
  }

  function renderSection(title, data) {
    return (
      <>
        <Text style={styles.sectionTitle}>{title}</Text>
        {data.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum registro neste período</Text>
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
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        <Text style={styles.title}>Faturamento</Text>

         <View style={styles.monthSelector}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'‹'}</Text>
        </TouchableOpacity>
 
        <Text style={styles.monthText}>
          {MONTHS[selectedMonth]} {selectedYear}
        </Text>
 
        <TouchableOpacity onPress={goToNextMonth} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'›'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardRow}>
        <View style={[styles.card, styles.highlightCard]}>
          <Text style={styles.cardTitle}>Total Faturado</Text>
          <Text style={styles.cardValue}>{formatCurrency(totalRevenue)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total do Mês</Text>
          <Text style={styles.cardNumber}>{appointmentsInMonth.length}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Ticket Médio</Text>
          <Text style={styles.cardNumber}>
            {formatCurrency(
              completedAppointments.length === 0
                ? 0
                : totalRevenue / completedAppointments.length
            )}
          </Text>
        </View>
      </View>

        <Text style={styles.sectionTitle}>Status dos Agendamentos</Text>

        {pieData.length > 0 ? (
          <PieChart
            data={pieData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
                 color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            />
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
    backgroundColor: colors.background,
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
    color: colors.textMuted,
    fontSize: 14,
  },
 

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
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
    color: COLORS.primary,
    lineHeight: 30,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
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
    backgroundColor: colors.white,
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
    backgroundColor: COLORS.primary,
  },
  cardTitle: {
    fontSize: 11,
    color: colors.white,
    marginBottom: 4,
    opacity: 0.95,
  },
  cardLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold', 
    color: colors.white,
  },
  cardNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
 

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },

  noDataText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
  },
 
  
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
  },

  appointmentCard: {
    backgroundColor: colors.white,
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
    color: colors.text,
    flex: 1,
  },
  appointmentSecondaryText: {
    fontSize: 13,
    color: colors.textMuted,
    flex: 1,
  },
  appointmentValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 8,
  },
  appointmentDate: {
    fontSize: 13,
    color: colors.textMuted,
    marginLeft: 8,
  },
});
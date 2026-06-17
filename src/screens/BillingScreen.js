import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

// ─── Paleta de status seguindo o tema rosa do app ────────────────────────────
const STATUS_CONFIG = {
  completed: { label: 'Concluído',  color: '#4CAF50' },
  scheduled: { label: 'Agendado',   color: '#E84D9A' },
  cancelled: { label: 'Cancelado',  color: '#F44336' },
  pending:   { label: 'Pendente',   color: '#FF9800' },
  unknown:   { label: 'Outros',     color: '#9E9E9E' },
};

const MONTHS = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(value) {
  // Remove pontos e troca vírgula por ponto para converter corretamente
  // Ex: "280,00" → 280.00 | "1.280,00" → 1280.00
  const cleaned = String(value || '0').replace(/\./g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  if (!Number.isFinite(num)) return 'R$ 0,00';
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function parsePriceToCents(value) {
  // Converte "280,00" ou "280.00" para número float
  const cleaned = String(value || '0').replace(/\./g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : 0;
}

function formatDate(timestamp) {
  if (!timestamp) return '-';
  try {
    const date = timestamp.toDate();
    return date.toLocaleDateString('pt-BR');
  } catch {
    return '-';
  }
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function FaturamentoTela() {
  const { theme } = useTheme();

  // Dados brutos do Firebase
  const [appointments, setAppointments] = useState([]);
  const [customersMap, setCustomersMap]  = useState({}); // { id: { name, telephone } }
  const [servicesMap, setServicesMap]    = useState({}); // { id: { procedure, price } }
  const [loading, setLoading]            = useState(true);

  // Navegação de mês
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear,  setSelectedYear]  = useState(today.getFullYear());

  // Modal de detalhe do cliente
  const [selectedClient, setSelectedClient] = useState(null); // { name, appointments[] }

  // ─── Busca Firebase ──────────────────────────────────────────────────────────

  useFocusEffect(
    useCallback(() => {
      async function fetchAll() {
        setLoading(true);
        try {
          // Busca as 3 coleções em paralelo para ser mais rápido
          const [schedSnap, custSnap, servSnap] = await Promise.all([
            getDocs(collection(db, 'scheduling')),
            getDocs(collection(db, 'customers')),
            getDocs(collection(db, 'services')),
          ]);

          // Monta mapas id → dados para cruzamento
          const cMap = {};
          custSnap.docs.forEach(doc => { cMap[doc.id] = doc.data(); });

          const sMap = {};
          servSnap.docs.forEach(doc => { sMap[doc.id] = doc.data(); });

          const list = schedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          setCustomersMap(cMap);
          setServicesMap(sMap);
          setAppointments(list);
        } catch (error) {
          console.error('Erro ao buscar dados:', error);
        } finally {
          setLoading(false);
        }
      }
      fetchAll();
    }, [])
  );



  function resolveClientName(item) {
    if (item.clientName) return item.clientName;                 // campo direto
    if (customersMap[item.client]) return customersMap[item.client].name; // ID válido
    if (item.title)  return item.title;                          // campo title do scheduling
    return 'Cliente Desconhecido';
  }

  function resolveServiceName(item) {
    if (item.serviceName) return item.serviceName;
    if (servicesMap[item.service]) return servicesMap[item.service].procedure;
    return 'Serviço Desconhecido';
  }

  // ─── Filtro por mês ──────────────────────────────────────────────────────────

  const appointmentsInMonth = appointments.filter(item => {
    if (!item.start) return false;
    try {
      const date = item.start.toDate();
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    } catch { return false; }
  });

  const completedAppointments = appointmentsInMonth.filter(i => i.status === 'completed');
  const pendingAppointments   = appointmentsInMonth.filter(i => i.status === 'pending');
  const cancelledAppointments = appointmentsInMonth.filter(i => i.status === 'cancelled');

  // ─── Métricas ────────────────────────────────────────────────────────────────

  const totalRevenue = completedAppointments.reduce(
    (sum, item) => sum + parsePriceToCents(item.servicePrice), 0
  );

  const ticketMedio = completedAppointments.length > 0
    ? totalRevenue / completedAppointments.length
    : 0;

  // ─── Ranking de clientes ─────────────────────────────────────────────────────
  // Agrupa todos os agendamentos do mês por cliente e soma o total gasto

  const clientRanking = (() => {
    const map = {}; // { clientKey: { name, total, count, appointments[] } }

    appointmentsInMonth.forEach(item => {
      const name = resolveClientName(item);
      const key  = item.client || name; // usa o ID como chave quando possível

      if (!map[key]) {
        map[key] = { name, total: 0, count: 0, appointments: [] };
      }

      map[key].total += parsePriceToCents(item.servicePrice);
      map[key].count += 1;
      map[key].appointments.push(item);
    });

    // Ordena por total decrescente
    return Object.values(map).sort((a, b) => b.total - a.total);
  })();

  // ─── Gráfico ─────────────────────────────────────────────────────────────────

  function buildPieData() {
    const counter = {};
    appointmentsInMonth.forEach(item => {
      const status = item.status || 'unknown';
      counter[status] = (counter[status] || 0) + 1;
    });
    return Object.keys(counter).map(status => {
      const config = STATUS_CONFIG[status] || STATUS_CONFIG.unknown;
      return {
        name: config.label,
        population: counter[status],
        color: config.color,
        legendFontColor: theme.subtitle,
        legendFontSize: 12,
      };
    });
  }

  const pieData = buildPieData();

  // ─── Navegação de mês ─────────────────────────────────────────────────────────

  function goToPreviousMonth() {
    if (selectedMonth === 0) { setSelectedYear(y => y - 1); setSelectedMonth(11); }
    else { setSelectedMonth(m => m - 1); }
  }
  function goToNextMonth() {
    if (selectedMonth === 11) { setSelectedYear(y => y + 1); setSelectedMonth(0); }
    else { setSelectedMonth(m => m + 1); }
  }

  // ─── Loading ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.subtitle }]}>
          Carregando faturamento...
        </Text>
      </View>
    );
  }

  // ─── Render card de agendamento (usado no modal) ──────────────────────────────

  function renderAppointmentDetail({ item }) {
    const serviceName = resolveServiceName(item);
    const statusCfg   = STATUS_CONFIG[item.status] || STATUS_CONFIG.unknown;

    return (
      <View style={[styles.detailCard, { backgroundColor: theme.card }]}>
        <View style={styles.appointmentRow}>
          <Text style={[styles.detailService, { color: theme.text }]}>{serviceName}</Text>
          <Text style={[styles.detailValue, { color: theme.primary }]}>
            {formatCurrency(item.servicePrice)}
          </Text>
        </View>
        <View style={styles.appointmentRow}>
          <View style={[styles.statusBadge, { backgroundColor: statusCfg.color + '22' }]}>
            <Text style={[styles.statusBadgeText, { color: statusCfg.color }]}>
              {statusCfg.label}
            </Text>
          </View>
          <Text style={[styles.detailDate, { color: theme.subtitle }]}>
            {formatDate(item.start)}
          </Text>
        </View>
      </View>
    );
  }

  // ─── Modal de detalhe da cliente ──────────────────────────────────────────────

  function ClientDetailModal() {
    if (!selectedClient) return null;

    const clientTotal = selectedClient.appointments.reduce(
      (sum, item) => sum + parsePriceToCents(item.servicePrice), 0
    );
    const clientCompleted = selectedClient.appointments.filter(
      i => i.status === 'completed'
    ).length;

    return (
      <Modal
        visible={!!selectedClient}
        animationType="slide"
        onRequestClose={() => setSelectedClient(null)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          {/* Header do modal */}
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <TouchableOpacity
              onPress={() => setSelectedClient(null)}
              style={styles.backButton}
            >
              <Text style={[styles.backButtonText, { color: theme.primary }]}>{'‹'} Voltar</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.text }]} numberOfLines={1}>
              {selectedClient.name}
            </Text>
            <View style={{ width: 70 }} />
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            {/* Cards de resumo da cliente */}
            <View style={styles.cardRow}>
              <View style={[styles.card, styles.highlightCard, { backgroundColor: theme.primary }]}>
                <Text style={styles.cardTitleLight}>Total Gasto</Text>
                <Text style={styles.cardValueWhite}>{formatCurrency(clientTotal)}</Text>
              </View>
              <View style={[styles.card, { backgroundColor: theme.card }]}>
                <Text style={[styles.cardLabel, { color: theme.subtitle }]}>Agendamentos</Text>
                <Text style={[styles.cardNumber, { color: theme.text }]}>
                  {selectedClient.appointments.length}
                </Text>
              </View>
              <View style={[styles.card, { backgroundColor: theme.card }]}>
                <Text style={[styles.cardLabel, { color: theme.subtitle }]}>Concluídos</Text>
                <Text style={[styles.cardNumber, { color: theme.text }]}>{clientCompleted}</Text>
              </View>
            </View>

            {/* Lista de agendamentos */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Histórico do mês
            </Text>
            <FlatList
              data={selectedClient.appointments}
              keyExtractor={item => item.id}
              renderItem={renderAppointmentDetail}
              scrollEnabled={false}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  }

  // ─── Render card de cliente no ranking ────────────────────────────────────────

  function renderClientCard({ item, index }) {
    return (
      <TouchableOpacity
        style={[styles.clientCard, { backgroundColor: theme.card }]}
        onPress={() => setSelectedClient(item)}
        activeOpacity={0.7}
      >
        {/* Posição no ranking */}
        <View style={[styles.rankBadge, { backgroundColor: theme.primary + '22' }]}>
          <Text style={[styles.rankNumber, { color: theme.primary }]}>{index + 1}</Text>
        </View>

        {/* Info da cliente */}
        <View style={styles.clientInfo}>
          <Text style={[styles.clientName, { color: theme.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.clientSub, { color: theme.subtitle }]}>
            {item.count} agendamento{item.count !== 1 ? 's' : ''} no mês
          </Text>
        </View>

        {/* Total gasto */}
        <View style={styles.clientRight}>
          <Text style={[styles.clientTotal, { color: theme.primary }]}>
            {formatCurrency(item.total)}
          </Text>
          <Text style={[styles.clientArrow, { color: theme.subtitle }]}>›</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // ─── UI principal ─────────────────────────────────────────────────────────────

  return (
    <>
      <ClientDetailModal />

      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >

        {/* Seletor de mês */}
        <View style={[styles.monthSelector, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity onPress={goToPreviousMonth} style={styles.arrowButton}>
            <Text style={[styles.arrowText, { color: theme.primary }]}>{'‹'}</Text>
          </TouchableOpacity>
          <Text style={[styles.monthText, { color: theme.text }]}>
            {MONTHS[selectedMonth]} {selectedYear}
          </Text>
          <TouchableOpacity onPress={goToNextMonth} style={styles.arrowButton}>
            <Text style={[styles.arrowText, { color: theme.primary }]}>{'›'}</Text>
          </TouchableOpacity>
        </View>

        {/* Cards de métricas */}
        <View style={styles.cardRow}>
          <View style={[styles.card, styles.highlightCard, { backgroundColor: theme.primary }]}>
            <Text style={styles.cardTitleLight}>Total Faturado</Text>
            <Text style={styles.cardValueWhite}>{formatCurrency(totalRevenue)}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardLabel, { color: theme.subtitle }]}>Atendimentos</Text>
            <Text style={[styles.cardNumber, { color: theme.text }]}>
              {appointmentsInMonth.length}
            </Text>
          </View>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardLabel, { color: theme.subtitle }]}>Ticket Médio</Text>
            <Text style={[styles.cardNumberSmall, { color: theme.text }]}>
              {formatCurrency(ticketMedio)}
            </Text>
          </View>
        </View>

        {/* Gráfico de pizza */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Status do mês</Text>
        {pieData.length > 0 ? (
          <PieChart
            data={pieData}
            width={screenWidth - 32}
            height={200}
            chartConfig={{ color: () => theme.text }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <Text style={[styles.emptyText, { color: theme.subtitle }]}>
            Nenhum agendamento neste mês
          </Text>
        )}

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Ranking de clientes */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Clientes do mês
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.subtitle }]}>
          Toque em uma cliente para ver o detalhamento
        </Text>

        {clientRanking.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.subtitle }]}>
            Nenhuma cliente neste mês
          </Text>
        ) : (
          <FlatList
            data={clientRanking}
            keyExtractor={(_, i) => String(i)}
            renderItem={renderClientCard}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  content:   { padding: 16, paddingBottom: 48 },
  centered:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14 },

  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 20,
    letterSpacing: -0.5,
  },

  // ── Mês ─────────────────────────────────────────────────────────────────────
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    marginBottom: 16,
  },
  arrowButton: { paddingHorizontal: 20, paddingVertical: 4 },
  arrowText:   { fontSize: 26, lineHeight: 28 },
  monthText:   { fontSize: 16, fontWeight: '700', minWidth: 160, textAlign: 'center' },

  // ── Cards métricas ───────────────────────────────────────────────────────────
  cardRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  card: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  highlightCard:   { flex: 1.5 },
  cardTitleLight: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardValueWhite:  { fontSize: 15, fontWeight: '800', color: '#FFF', textAlign: 'center' },
  cardLabel: {
    fontSize: 10,
    marginBottom: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardNumber:      { fontSize: 22, fontWeight: '800' },
  cardNumberSmall: { fontSize: 13, fontWeight: '700', textAlign: 'center' },

  // ── Seções ───────────────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    marginBottom: 12,
  },
  divider: { height: 1, marginVertical: 20 },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 14,
    fontStyle: 'italic',
  },

  // ── Card de cliente no ranking ────────────────────────────────────────────────
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    gap: 12,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber:  { fontSize: 14, fontWeight: '800' },
  clientInfo:  { flex: 1 },
  clientName:  { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  clientSub:   { fontSize: 12 },
  clientRight: { alignItems: 'flex-end', flexDirection: 'row', gap: 4 },
  clientTotal: { fontSize: 14, fontWeight: '700' },
  clientArrow: { fontSize: 20, lineHeight: 22 },

  // ── Modal ────────────────────────────────────────────────────────────────────
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backButton:     { width: 70 },
  backButtonText: { fontSize: 16, fontWeight: '600' },
  modalTitle:     { fontSize: 16, fontWeight: '700', flex: 1, textAlign: 'center' },
  modalContent:   { padding: 16, paddingBottom: 48 },

  // ── Cards de detalhe no modal ─────────────────────────────────────────────────
  detailCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  appointmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailService: { fontSize: 14, fontWeight: '700', flex: 1, marginRight: 8 },
  detailValue:   { fontSize: 14, fontWeight: '700' },
  detailDate:    { fontSize: 12 },
  statusBadge: {
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
});
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../context/ThemeContext';

const CalendarioTela = () => {
  const { theme, selectedTheme } = useTheme();
  const [dataAtual, setDataAtual] = useState(new Date());
  const [agendamentos, setAgendamentos] = useState([]);

  // Obter o primeiro dia do mês
  const getPrimeiroDiaDoMes = (data) => {
    return new Date(data.getFullYear(), data.getMonth(), 1);
  };

  // Obter o último dia do mês
  const getUltimoDiaDoMes = (data) => {
    return new Date(data.getFullYear(), data.getMonth() + 1, 0);
  };

  // Gerar array com os dias do mês
  const gerarDiasMes = () => {
    const primeiroDia = getPrimeiroDiaDoMes(dataAtual);
    const ultimoDia = getUltimoDiaDoMes(dataAtual);
    const diasDoMes = [];

    // Adicionar dias vazios do mês anterior
    for (let i = 0; i < primeiroDia.getDay(); i++) {
      diasDoMes.push(null);
    }

    // Adicionar dias do mês atual
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      diasDoMes.push(dia);
    }

    return diasDoMes;
  };

  const diasMes = gerarDiasMes();
  const nomeMes = dataAtual.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  const mesAnterior = () => {
    setDataAtual(new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 1));
  };

  const proximoMes = () => {
    setDataAtual(new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1));
  };

  const selecionarData = (dia) => {
    if (dia) {
      const dataSelecionada = new Date(
        dataAtual.getFullYear(),
        dataAtual.getMonth(),
        dia
      );
      console.log('Data selecionada:', dataSelecionada);
    }
  };

  const hoje = new Date();
  const ehHoje = (dia) => {
    if (!dia) return false;
    return (
      dia === hoje.getDate() &&
      dataAtual.getMonth() === hoje.getMonth() &&
      dataAtual.getFullYear() === hoje.getFullYear()
    );
  };

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <StatusBar style={theme.background === '#121212' ? 'light' : 'dark'} />

      {/* Navegação do mês */}
      <View style={[styles.mesContainer, { backgroundColor: theme.card }]}> 
        <TouchableOpacity onPress={mesAnterior} style={[styles.botaoNav, { backgroundColor: theme.primary }]}> 
          <Text style={styles.botaoNavTexto}>←</Text>
        </TouchableOpacity>

<Text style={[styles.mesTitulo, { color: theme.text }]}>{nomeMes}</Text>

        <TouchableOpacity onPress={proximoMes} style={styles.botaoNav}>
          <Text style={styles.botaoNavTexto}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Dias da semana */}
      <View style={[styles.diasSemanaContainer, { backgroundColor: theme.card }]}> 
        {diasSemana.map((dia, index) => (
          <Text key={index} style={[styles.diaSemana, { color: theme.subtitle }]}> 
            {dia}
          </Text>
        ))}
      </View>

      {/* Grid de dias */}
      <View style={[styles.diasGrid, { backgroundColor: theme.card }]}> 
        {diasMes.map((dia, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => selecionarData(dia)}
            style={[
              styles.diaItem,
              dia === null && styles.diaNulo,
              ehHoje(dia) && styles.diaHoje,
            ]}
          >
            {dia && (
              <Text
                style={[
                  styles.diaTexto,
                  { color: theme.text },
                  ehHoje(dia) && styles.diaHojeTexto,
                ]}
              >
                {dia}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Agendamentos do dia */}
      <View style={[styles.agendamentosContainer, { backgroundColor: theme.card }]}> 
        <Text style={[styles.agendamentosTitle, { color: selectedTheme === 'dark' ? theme.primary : theme.text }]}>Agendamentos de Hoje</Text>
        <ScrollView>
          <View style={styles.agendamentosList}>
            {agendamentos.length === 0 ? (
              <Text style={[styles.semAgendamentos, { color: theme.subtitle }]}> 
                Nenhum agendamento para hoje
              </Text>
            ) : (
              agendamentos.map((agendamento, index) => (
                <View key={index} style={styles.agendamentoItem}>
                  <Text style={styles.agendamentoHora}>
                    {agendamento.hora}
                  </Text>
                  <Text style={styles.agendamentoCliente}>
                    {agendamento.cliente}
                  </Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#d946a6',
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  mesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  mesTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  botaoNav: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d946a6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoNavTexto: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  diasSemanaContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 15,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  diaSemana: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 12,
  },
  diasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginTop: 5,
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  diaItem: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 5,
  },
  diaNulo: {
    backgroundColor: '#99999922',
  },
  diaTexto: {
    fontSize: 14,
    fontWeight: '500',
  },
  diaHoje: {
    backgroundColor: '#d946a6',
  },
  diaHojeTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  agendamentosContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  agendamentosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  agendamentosList: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  agendamentoItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#d946a6',
  },
  agendamentoHora: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  agendamentoCliente: {
    fontSize: 13,
    marginTop: 5,
  },
  semAgendamentos: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default CalendarioTela;

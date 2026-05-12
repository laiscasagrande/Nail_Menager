import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import ActionButtonAdd from '../../components/ActionButtonAdd';
import { COLORS } from '../../constants/colors';
import { Pencil, Trash2 } from 'lucide-react-native';

export default function ScreenServices() {
  const services = [
    {
      id: '1',
      name: 'Alongamento em Gel',
      price: '120,00',
      duration: '2h',
      image:
        'https://images.unsplash.com/photo-1610992015732-2449b76344bc?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: '2',
      name: 'Manicure Tradicional',
      price: '45,00',
      duration: '1h',
      image:
        'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: '3',
      name: 'Spa dos Pés',
      price: '60,00',
      duration: '1h30',
      image:
        'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=800&auto=format&fit=crop',
    },
  ];

  function renderService({ item }) {
    return (
      <View style={styles.card}>
        <Image
          source={{ uri: item.image }}
          style={styles.cardImage}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <View style={styles.dataLinha}>
            <Text style={styles.price}>R$ {item.price}</Text>
            <Text style={styles.dataTexto}>{item.duration}</Text>
          </View>
        </View>
        <View style={styles.cardButtons}>
          <TouchableOpacity>
            <Pencil size={20} color={COLORS.primary}/>
          </TouchableOpacity>
          <TouchableOpacity>
            <Trash2 size={20} color={COLORS.primary}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <FlatList
        data={services}
        renderItem={renderService}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <View style={styles.fab}>
        <ActionButtonAdd />
      </View>

    </SafeAreaView>
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
    flex: 1
  },

  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: '#FCE4EC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardInfo: {
    flex: 1,
    height: '90%',
    justifyContent: 'space-between'
  },

  dataLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },

  cardButtons: {
    flexDirection: 'column',
    alignItems: 'center',
    height: '90%',
    justifyContent: 'space-between',
    fontSize: 12,
  },

  dataTexto: {
    flex: 1,
    fontSize: 12,
    color: '#888',
  },

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  list: {
    padding: 12,
    gap: 12,
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 25,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
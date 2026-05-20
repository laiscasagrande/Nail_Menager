import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Modal,
} from 'react-native';

import { TextInput } from 'react-native-paper';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';

import * as ImagePicker from 'expo-image-picker';

import { Pencil, Trash2 } from 'lucide-react-native';

import ActionButtonAdd from '../../components/ActionButtonAdd';
import { COLORS } from '../../constants/colors';
import { db } from '../../services/firebase';

export default function ScreenServices() {
  const [services, setServices] = useState([]);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [image, setImage] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    seekServices();
  }, []);

  async function seekServices() {
    try {
      const snapshot = await getDocs(collection(db, 'services'));

      const serviceList = snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      }));

      setServices(serviceList);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os serviços.');
    }
  }

  function resetForm() {
    setName('');
    setPrice('');
    setDuration('');
    setImage(null);
    setEditingId(null);
    setModalVisible(false);
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  async function handleSave() {
    const payload = {
      name: name.trim(),
      price: price.trim(),
      duration: duration.trim(),
      image,
    };

    if (!payload.name) {
      Alert.alert('Atenção', 'Informe o nome do serviço.');
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, 'services', editingId), payload);

        setServices((prev) =>
          prev.map((service) =>
            service.id === editingId
              ? { ...service, ...payload }
              : service
          )
        );
      } else {
        const docRef = await addDoc(
          collection(db, 'services'),
          payload
        );

        setServices((prev) => [
          { id: docRef.id, ...payload },
          ...prev,
        ]);
      }

      resetForm();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o serviço.');
    }
  }

  function handleEdit(service) {
    setEditingId(service.id);

    setName(service.name || '');
    setPrice(service.price || '');
    setDuration(service.duration || '');
    setImage(service.image || null);

    setModalVisible(true);
  }

  function confirmDelete(service) {
    Alert.alert(
      'Excluir serviço',
      `Deseja remover ${service.name}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteService(service.id),
        },
      ]
    );
  }

  async function deleteService(id) {
    try {
      await deleteDoc(doc(db, 'services', id));

      setServices((prev) =>
        prev.filter((service) => service.id !== id)
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível deletar o serviço.');
    }
  }

  function renderService({ item }) {
    return (
      <View style={styles.card}>
        <Image
          source={{
            uri:
              item.image ||
              'https://via.placeholder.com/150',
          }}
          style={styles.cardImage}
        />

        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>
            {item.name}
          </Text>

          <View style={styles.dataLinha}>
            <Text style={styles.price}>
              R$ {item.price}
            </Text>

            <Text style={styles.dataTexto}>
              {item.duration}
            </Text>
          </View>
        </View>

        <View style={styles.cardButtons}>
          <TouchableOpacity
            onPress={() => handleEdit(item)}
          >
            <Pencil
              size={20}
              color={COLORS.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => confirmDelete(item)}
          >
            <Trash2
              size={20}
              color={COLORS.primary}
            />
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
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum serviço cadastrado.
          </Text>
        }
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>
              {editingId
                ? 'Editar serviço'
                : 'Novo serviço'}
            </Text>

            <TextInput
              label="Procedimento"
              value={name}
              mode="outlined"
              onChangeText={setName}
              style={styles.input}
            />

            <TextInput
              label="Preço"
              value={price}
              mode="outlined"
              onChangeText={setPrice}
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              label="Duração"
              value={duration}
              mode="outlined"
              onChangeText={setDuration}
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.imageButton}
              onPress={pickImage}
            >
              <Text style={styles.buttonText}>
                Escolher imagem
              </Text>
            </TouchableOpacity>

            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.preview}
              />
            ) : null}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>
                  {editingId
                    ? 'Atualizar'
                    : 'Salvar'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={resetForm}
              >
                <Text style={styles.buttonTextSecondary}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      <View style={styles.fab}>
        <ActionButtonAdd
          onPress={() => setModalVisible(true)}
        />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  list: {
    padding: 12,
    gap: 12,
    paddingBottom: 100,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: '#FCE4EC',
  },

  cardInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },

  dataLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },

  price: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },

  dataTexto: {
    fontSize: 12,
    color: '#888',
  },

  cardButtons: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 55,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 16,
  },

  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },

  imageButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 14,
  },

  preview: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    marginBottom: 16,
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },

  buttonPrimary: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonSecondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },

  buttonTextSecondary: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#888',
  },
});
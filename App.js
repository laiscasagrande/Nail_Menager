import React, { use, useEffect, useState } from 'react';
import {View,Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Modal, TextInput, Image, Alert, KeyboardAvoidingView, Platform, ScrollView,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, Feather } from '@expo/vector-icons';

export default function App() {
 const [Services, setServices] = useState([]);
 const [serviceName, setServiceName] = useState('');
 const [servicePrice, setServicePrice] = useState('');
 const [serviceDuration, setServiceDuration] = useState('');
 const [serviceImage, setServiceImage] = useState('');

 const [editingId, setEditingId] = useState(null);
}

useEffect(() => {
  loadServices();
}, []);

useEffect(() => {
  saveServices();
}, [Services]);

Async function loadServices() {
  try {
    const data = await AsyncStorage.getItem('services');
    if (data) {
      setServices(JSON.parse(data));
    }
  } catch (e) {
    console.log(e);
  }
}

  async function saveServices() {
    try {
      await AsyncStorage.setItem(
        '@services',
        JSON.stringify(services)
      );
    } catch (e) {
      console.log(e);
    }
  }


async function pickImage() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Permission required', 'Permission to access media library is required!');
      
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.mediaTypesOptions.Images,
    quality: 1,
  });

  if (!result.canceled) {
    setServiceImage(result.assets[0].uri);
  }
}

 function openCreateModal() {
    setEditingId(null);

    setServiceName('');
    setServicePrice('');
    setServiceDuration('');
    setServiceImage('');

    setModalVisible(true);
  }

  function handleEdit(item) {
    setEditingId(item.id);

    setServiceName(item.name);
    setServicePrice(item.price);
    setServiceDuration(item.duration);
    setServiceImage(item.image);

    setModalVisible(true);
  }

  function handleSave() {
    if (
      !serviceName ||
      !servicePrice ||
      !serviceDuration
    ) {
      Alert.alert(
        'Erro',
        'Preencha todos os campos.'
      );

      return;
    }
  }


      if (editingId) {
      const updatedServices = services.map((item) => {
        if (item.id === editingId) {
          return {
            ...item,
            name: serviceName,
            price: servicePrice,
            duration: serviceDuration,
            image: serviceImage,
          };
        }

        return item;
      });

      setServices(updatedServices);
    } else {
      cosnt newService = {
        id: Date.now().toString(),
        name: serviceName,
        price: servicePrice,
        duration: serviceDuration,
         image:
          serviceImage ||
          'https://cdn-icons-png.flaticon.com/512/1829/1829586.png',
      };
      setServices([...services, newService]);
    }
    
    setModalVisible(false);
  

  function handleDelete(id) {
    Alert.alert(
      'Excluir serviço',
      'Deseja realmente excluir?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },

        {
          text: 'Excluir',

          onPress: () => {
            const filtered = services.filter(
              (item) => item.id !== id
            );

            setServices(filtered);
          },
        },
      ]
    );
  }

function renderService({ item }) {
    return (
      <View style={styles.card}>
        <Image
          source={{ uri: item.image }}
          style={styles.cardImage}
        />

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            {item.name}
          </Text>

          <Text style={styles.cardText}>
            R$ {item.price}
          </Text>

          <Text style={styles.cardText}>
            {item.duration}
          </Text>
        </View>

        <View style={styles.cardButtons}>
          <TouchableOpacity
            onPress={() => handleEdit(item)}
          >
            <Feather
              name="edit"
              size={22}
              color="#ff4fa0"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginTop: 15 }}
            onPress={() => handleDelete(item.id)}
          >
            <Feather
              name="trash"
              size={22}
              color="#ff4fa0"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

   return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity>
          <Feather
            name="menu"
            size={28}
            color="#fff"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Serviços
        </Text>

        <View style={{ width: 28 }} />
      </View>

      {/* LISTA */}

      {services.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhum serviço cadastrado
          </Text>
        </View>
      ) : (
        <FlatList
          data={services}
          renderItem={renderService}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      {/* BOTÃO + */}

      <TouchableOpacity
        style={styles.fab}
        onPress={openCreateModal}
      >
        <AntDesign
          name="plus"
          size={28}
          color="#fff"
        />
      </TouchableOpacity>

      {/* MODAL */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
        >
          <ScrollView
            contentContainerStyle={
              styles.modalOverlay
            }
          >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                {editingId
                  ? 'Editar Serviço'
                  : 'Novo Serviço'}
              </Text>

              {/* NOME */}

              <TextInput
                placeholder="Nome do serviço"
                style={styles.input}
                value={serviceName}
                onChangeText={setServiceName}
              />

              {/* PREÇO */}

              <TextInput
                placeholder="Preço"
                style={styles.input}
                keyboardType="numeric"
                value={servicePrice}
                onChangeText={setServicePrice}
              />

              {/* DURAÇÃO */}

              <TextInput
                placeholder="Duração"
                style={styles.input}
                value={serviceDuration}
                onChangeText={setServiceDuration}
              />

              {/* IMAGEM */}

              <TouchableOpacity
                style={styles.imageButton}
                onPress={pickImage}
              >
                <Text style={styles.imageButtonText}>
                  Selecionar imagem
                </Text>
              </TouchableOpacity>

              {serviceImage ? (
                <Image
                  source={{ uri: serviceImage }}
                  style={styles.preview}
                />
              ) : null}

              {/* SALVAR */}

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>
                  Salvar
                </Text>
              </TouchableOpacity>

              {/* CANCELAR */}

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() =>
                  setModalVisible(false)
                }
              >
                <Text
                  style={styles.cancelButtonText}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );


  const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },

  header: {
    height: 90,
    backgroundColor: '#ff4fa0',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 20,
    paddingTop: 20,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },

  list: {
    padding: 20,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: '#fff',

    borderRadius: 18,

    padding: 12,
    marginBottom: 16,

    flexDirection: 'row',
    alignItems: 'center',

    elevation: 4,
  },

  cardImage: {
    width: 75,
    height: 75,
    borderRadius: 12,
  },

  cardContent: {
    flex: 1,
    marginLeft: 14,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },

  cardText: {
    marginTop: 4,
    color: '#ff4fa0',
    fontWeight: '600',
  },

  cardButtons: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  fab: {
    position: 'absolute',

    right: 25,
    bottom: 30,

    width: 65,
    height: 65,

    borderRadius: 100,

    backgroundColor: '#ff4fa0',

    justifyContent: 'center',
    alignItems: 'center',

    elevation: 6,
  },

  modalOverlay: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(0,0,0,0.4)',

    padding: 20,
  },

  modalContainer: {
    width: '100%',

    backgroundColor: '#fff',

    borderRadius: 24,

    padding: 24,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',

    color: '#ff4fa0',

    marginBottom: 20,

    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',

    borderRadius: 14,

    padding: 14,

    marginBottom: 14,

    fontSize: 16,
  },

  imageButton: {
    borderWidth: 1,
    borderColor: '#ff4fa0',
    borderStyle: 'dashed',

    padding: 16,

    borderRadius: 14,

    alignItems: 'center',

    marginBottom: 16,
  },

  imageButtonText: {
    color: '#ff4fa0',
    fontWeight: 'bold',
  },

  preview: {
    width: '100%',
    height: 180,

    borderRadius: 16,

    marginBottom: 16,
  },

  saveButton: {
    backgroundColor: '#ff4fa0',

    padding: 16,

    borderRadius: 14,

    alignItems: 'center',
  },

  saveButtonText: {
    color: '#fff',

    fontSize: 18,
    fontWeight: 'bold',
  },

  cancelButton: {
    padding: 14,
    marginTop: 10,

    alignItems: 'center',
  },

  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },

  emptyContainer: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 18,
    color: '#999',
  },
});

  
    
  

  
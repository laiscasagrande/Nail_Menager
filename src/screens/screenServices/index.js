import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, Feather } from '@expo/vector-icons';

export default function ScreenServices() {
  const [services, setServices] = useState([]);

  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  const [serviceImage, setServiceImage] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    saveServices();
  }, [services]);

  async function loadServices() {
    try {
      const data = await AsyncStorage.getItem('@services');

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
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permissão necessária',
        'Permissão para acessar a galeria é necessária!'
      );

      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,
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

    if (editingId) {
      const updatedServices = services.map(
        (item) => {
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
        }
      );

      setServices(updatedServices);
    } else {
      const newService = {
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
  }

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
            onPress={() =>
              handleDelete(item.id)
            }
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

              <TextInput
                placeholder="Nome do serviço"
                style={styles.input}
                value={serviceName}
                onChangeText={setServiceName}
              />

              <TextInput
                placeholder="Preço"
                style={styles.input}
                keyboardType="numeric"
                value={servicePrice}
                onChangeText={setServicePrice}
              />

              <TextInput
                placeholder="Duração"
                style={styles.input}
                value={serviceDuration}
                onChangeText={setServiceDuration}
              />

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

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>
                  Salvar
                </Text>
              </TouchableOpacity>

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
});
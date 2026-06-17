import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import { Feather } from '@expo/vector-icons';
import { FormProvider } from 'react-hook-form';

import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/colors';

import { ServiceCard } from './components/serviceCard';
import { useService } from './hooks/useService';
import { FormSheetServices } from './components/formSheetServices';

export default function ScreenServices() {
  const { theme } = useTheme();

  const {
    methods,
    services,
    editingId,
    sheetOpen,
    handlers,
    sheetRef,
    loading,  
  } = useService();

  useEffect(() => {
    handlers.seekServices();
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.background }
        ]}
      >
        <ActivityIndicator
          size="large"
          color={theme.primary}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background }
      ]}
    >
      <FlatList
        data={services}
        renderItem={({ item }) => (
          <ServiceCard
            item={item}
            onEdit={handlers.handleEdit}
            onDelete={handlers.confirmDelete}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text
            style={[
              styles.emptyText,
              { color: theme.subtitle }
            ]}
          >
            Nenhum serviço cadastrado.
          </Text>
        }
      />

      <FormProvider {...methods}>
        <FormSheetServices
          ref={sheetRef}
          editingId={editingId}
          pickImage={handlers.pickImage}
          onSave={handlers.handleSave}
          onCancel={handlers.resetForm}
          onSheetChange={handlers.handleSheetChange}
        />
      </FormProvider>

      {!sheetOpen && (
        <View style={styles.fab}>
          <TouchableOpacity
            style={[
              styles.buttonAdd,
              { backgroundColor: theme.primary }
            ]}
            onPress={() => sheetRef.current?.expand()}
          >
            <Feather
              name="plus"
              size={28}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  list: {
    padding: 12,
    gap: 12,
    paddingBottom: 100,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#888',
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

  buttonAdd: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
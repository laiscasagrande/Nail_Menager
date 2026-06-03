import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { FormProvider } from 'react-hook-form';
import ActionButtonAdd from '../../components/ActionButtonAdd';
import { ServiceCard } from './components/serviceCard';
import { FormSheetServices } from './components/FormSheetServices';
import { useService } from './hooks/useService';

export default function ScreenServices() {
  const { methods, services, editingId, sheetOpen, setSheetOpen, handlers } = useService();
  const sheetRef = useRef(null);

  useEffect(() => {
    handlers.seekServices();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
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
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum serviço cadastrado.</Text>
        }
      />

      <FormProvider {...methods}>
        <FormSheetServices
          ref={sheetRef}
          editingId={editingId}
          pickImage={handlers.pickImage}
          onSave={handlers.handleSave}
          onCancel={handlers.resetForm}
          onSheetChange={(index) => setSheetOpen(index === 1)}
        />
      </FormProvider>

      {!sheetOpen && (
        <View style={styles.fab}>
          <ActionButtonAdd onPress={() => sheetRef.current?.expand()} />
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
});
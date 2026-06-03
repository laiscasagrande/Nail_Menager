import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { Alert } from "react-native";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../../services/firebase";
import { formService } from "../../../schemas/serviceSchema";

export function useService() {
    const [services, setServices] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [sheetOpen, setSheetOpen] = useState(false);

    const methods = useForm({
        resolver: zodResolver(formService),
        defaultValues: {
            id: "",
            procedure: "",
            price: "",
            duration: "",
            image: null,
        },
    });

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

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            methods.setValue('image', result.assets[0].uri);
        }
    }

    async function handleSave(data) {
        const payload = {
            procedure: data.procedure,
            price: data.price,
            duration: data.duration,
            image: data.image,
        };

        try {
            if (editingId) {
                await updateDoc(doc(db, 'services', editingId), payload);
                setServices((prev) =>
                    prev.map((service) =>
                        service.id === editingId ? { ...service, ...payload } : service
                    )
                );
            } else {
                const docRef = await addDoc(collection(db, 'services'), payload);
                setServices((prev) => [{ id: docRef.id, ...payload }, ...prev]);
            }
            resetForm();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar o serviço.');
        }
    }

    function handleEdit(service) {
        setEditingId(service.id);
        methods.reset({
            id: service.id,
            procedure: service.procedure || '',
            price: service.price || '',
            duration: service.duration || '',
            image: service.image || null,
        });
        setSheetOpen(true);
    }

    function resetForm() {
        methods.reset({
            id: "",
            procedure: "",
            price: "",
            duration: "",
            image: null,
        });
        setEditingId(null);
        setSheetOpen(false);
    }

    function confirmDelete(service) {
        Alert.alert(
            'Excluir serviço',
            `Deseja remover ${service.procedure}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Excluir', style: 'destructive', onPress: () => deleteService(service.id) },
            ]
        );
    }

    async function deleteService(id) {
        try {
            await deleteDoc(doc(db, 'services', id));
            setServices((prev) => prev.filter((service) => service.id !== id));
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível deletar o serviço.');
        }
    }

    return {
        methods,
        services,
        editingId,
        sheetOpen,
        setSheetOpen,
        handlers: {
            seekServices,
            pickImage,
            handleSave,
            handleEdit,
            resetForm,
            confirmDelete,
        },
    };
}
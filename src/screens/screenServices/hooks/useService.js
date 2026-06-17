import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as ImagePicker from 'expo-image-picker';
import { useContext, useRef, useState } from "react";
import { Alert } from "react-native";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where
} from "firebase/firestore";

import { db } from "../../../services/firebase";
import { formService } from "../../../schemas/serviceSchema";
import { AuthContext } from "../../../context/AuthContext";

export function useService() {

    const { user } = useContext(AuthContext);

    const [services, setServices] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const sheetRef = useRef(null);

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
        if (!user?.uid) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const q = query(
                collection(db, "services"),
                where("uid", "==", user.uid)
            );

            const snapshot = await getDocs(q);

            const serviceList = snapshot.docs.map((docSnapshot) => ({
                id: docSnapshot.id,
                ...docSnapshot.data(),
            }));

            setServices(serviceList);

        } catch (error) {
            Alert.alert(
                "Erro",
                "Não foi possível carregar os serviços."
            );
        } finally {
            setLoading(false);
        }
    }

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            methods.setValue("image", result.assets[0].uri);
        }
    }

    async function handleSave(data) {
        if (!user?.uid) {
            Alert.alert(
                "Erro",
                "Usuário não autenticado"
            );
            return;
        }

        const payload = {
            uid: user.uid,
            procedure: data.procedure,
            price: data.price,
            duration: data.duration,
            image: data.image,
        };

        try {
            if (editingId) {

                const serviceRef = doc(
                    db,
                    "services",
                    editingId
                );

                const serviceSnap = await getDoc(serviceRef);

                if (!serviceSnap.exists()) {
                    console.log("Serviço não encontrado");
                    return;
                }

                if (serviceSnap.data().uid !== user.uid) {
                    console.log("Sem permissão");
                    return;
                }

                await updateDoc(serviceRef, payload);

            } else {
                await addDoc(
                    collection(db, "services"),
                    payload
                );
            }

            await seekServices();
            resetForm();

        } catch (error) {
            Alert.alert(
                "Erro",
                "Não foi possível salvar o serviço."
            );
        }
    }

    function handleEdit(service) {
        setEditingId(service.id);

        methods.reset({
            id: service.id,
            procedure: service.procedure || "",
            price: service.price || "",
            duration: service.duration || "",
            image: service.image || null,
        });

        setSheetOpen(true);
        sheetRef.current?.expand();
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
        sheetRef.current?.close();
    }

    function confirmDelete(service) {
        Alert.alert(
            "Excluir serviço",
            `Deseja remover ${service.procedure}?`,
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: () => deleteService(service.id)
                }
            ]
        );
    }

    async function deleteService(id) {
        try {
            const serviceRef = doc(
                db,
                "services",
                id
            );

            const serviceSnap = await getDoc(serviceRef);

            if (!serviceSnap.exists()) return;

            if (serviceSnap.data().uid !== user.uid) {
                console.log("Sem permissão");
                return;
            }

            await deleteDoc(serviceRef);

            setServices((prev) =>
                prev.filter(
                    (service) => service.id !== id
                )
            );

        } catch (error) {
            Alert.alert(
                "Erro",
                "Não foi possível deletar o serviço."
            );
        }
    }

    function handleSheetChange(index) {
        setSheetOpen(index >= 0);

        if (index === -1) {
            resetForm();
        }
    }

    return {
        methods,
        services,
        editingId,
        sheetOpen,
        setSheetOpen,
        sheetRef,
        loading,
        handlers: {
            seekServices,
            pickImage,
            handleSave,
            handleEdit,
            resetForm,
            confirmDelete,
            handleSheetChange,
        },
    };
}
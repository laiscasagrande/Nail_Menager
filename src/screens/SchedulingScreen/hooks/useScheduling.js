import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { formScheduling } from "../../../schemas/schedulingSchema";
import { v4 as uuidv4 } from 'uuid';
import { COLORS } from "../../../constants/colors";
import { DraggingEvent } from "@howljs/calendar-kit";
import { Text, View } from "react-native";
import { ca, is } from "zod/locales";
import { addDoc, collection, doc, getDoc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../../services/firebase";

export const CLIENTS = [
    { label: "Laís Kaminski Casagrande", value: "1" },
    { label: "João Silva", value: "2" },
    { label: "Maria Souza", value: "3" },
];

export const SERVICES = [
    {
        label: "Manicure Tradicional",
        value: "1",
        price: 50
    },
    {
        label: "Alongamento em Gel",
        value: "2",
        price: 120
    },
    {
        label: "Banho de Gel",
        value: "3",
        price: 80
    },
];

export function useScheduling() {

    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [idEvent, setIdEvent] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [services, setServices] = useState([]);

    const bottomSheetRef = useRef(null);

    const methods = useForm({
        resolver: zodResolver(formScheduling),
        defaultValues: {
            id: "",
            client: "",
            service: "",
            dateStart: new Date(),
            dateEnd: new Date(),
            status: "scheduled"
        },
    })

    const handleDragCreateStart = (start) => {
        console.log("começou:", start);
    };

    const handleDragCreateEnd = (event) => {
        if (!event) return;
        setIsEditing(false)

        bottomSheetRef.current.expand();

        const createdEvent = {
            ...event,
            id: uuidv4(),
            title: "",
            status: "scheduled"
        };

        methods.reset({
            client: "",
            service: "",
            dateStart: new Date(event.start.dateTime),
            dateEnd: new Date(event.end.dateTime),
            status: "scheduled"
        });

        setIdEvent(createdEvent.id)
        setEvents((prev) => [...prev, createdEvent]);
    };

    const handleDragStart = (event) => {
        console.log("editando:", event);
    };

    const handleDragEnd = (event) => {

        setEvents((prev) =>
            prev.map((e) =>
                e.id === event.id
                    ? {
                        ...e,
                        ...event,
                    }
                    : e
            )
        );

        setSelectedEvent(null);
    };

    async function handleCreateScheduling(data) {

        const selectedClient = CLIENTS.find(
            (client) => client.value === data.client
        );

        const selectedService = SERVICES.find(
            (service) => service.value === data.service
        );

        try {
            await addDoc(collection(db, "scheduling"), {
                client: data.client,
                service: data.service,
                servicePrice: selectedService?.price || 0,
                title: selectedClient?.label || "",
                start: Timestamp.fromDate(new Date(data.dateStart)),
                end: Timestamp.fromDate(new Date(data.dateEnd)),
                status: "scheduled",
            })

            await getSchedulings();

            setIdEvent(null)
            setSelectedEvent(null)
            methods.reset({
                client: "",
                service: "",
                dateStart: new Date(),
                dateEnd: new Date(),
                status: "scheduled"
            })
            bottomSheetRef.current.close()
        } catch (error) {
            console.log("Erro ao criar agendamento:", error);
        }
    }

    async function handleEditScheduling(data) {

        const selectedClient = CLIENTS.find(
            (client) => client.value === data.client
        );

        const selectedService = SERVICES.find(
            (service) => service.value === data.service
        );

        try {
            await updateDoc(doc(db, "scheduling", data.id), {
                client: data.client,
                service: data.service,
                servicePrice: selectedService?.price || 0,
                title: selectedClient?.label || "",
                start: Timestamp.fromDate(data.dateStart),
                end: Timestamp.fromDate(data.dateEnd),
                status: data.status,
            });

            setIdEvent(null);
            setSelectedEvent(null);

            setEvents((prev) =>
                prev.map((event) =>
                    event.id === data.id ?
                        {
                            ...event,
                            client: data.client,
                            service: data.service,
                            servicePrice: selectedService?.price || 0,
                            title: selectedClient?.label || "",
                            start: {
                                dateTime: data.dateStart.toISOString(),
                            },
                            end: {
                                dateTime: data.dateEnd.toISOString(),
                            },
                            status: data.status,
                        } : event
                ))

            methods.reset({
                id: "",
                client: "",
                service: "",
                dateStart: new Date(),
                dateEnd: new Date(),
                status: "scheduled"
            });

            bottomSheetRef.current.close()

        } catch (error) {
            console.log("Erro ao editar agendamento:", error);
        }
    }

    async function getSchedulingById(id) {
        setIsEditing(true)
        try {
            const schedulingSnap = await getDoc(doc(db, "scheduling", id))

            bottomSheetRef.current.expand()
            if (schedulingSnap.exists()) {
                methods.reset({
                    id: schedulingSnap.id,
                    client: schedulingSnap.data().client,
                    service: schedulingSnap.data().service,
                    dateStart: new Date(schedulingSnap.data().start.toDate()),
                    dateEnd: new Date(schedulingSnap.data().end.toDate()),
                    status: schedulingSnap.data().status
                })
            } else {
                console.log("Nenhum agendamento encontrado com o ID:", id);
                return null
            }
        } catch (error) {
            console.log("Erro ao buscar agendamento por ID:", error);
        }
    }

    async function getSchedulings() {
        try {
            const getData = await getDocs(collection(db, "scheduling"))

            const data = getData.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                start: {
                    dateTime: doc.data().start?.toDate?.().toISOString(),
                },

                end: {
                    dateTime: doc.data().end?.toDate?.().toISOString(),
                },
            }))

            setEvents(data)
        } catch (error) {
            console.log("Erro ao buscar agendamentos:", error);
            return []
        }
    }

    useEffect(() => {
        getSchedulings()
    }, [])

    async function handlePressCancel(data) {

        try {
            await updateDoc(doc(db, "scheduling", data.id), {
                status: "cancelled",
            });

            setEvents((prev) =>
                prev.map((e) =>
                    e.id === data.id
                        ? {
                            ...e,
                            status: "cancelled"
                        }
                        : e
                )
            )

            bottomSheetRef.current.close()
            setSelectedEvent(null)
        } catch (error) {
            console.log("Erro ao cancelar agendamento:", error);
        }
    }

    async function handlePressCompleted(data) {

        try {
            await updateDoc(doc(db, "scheduling", data.id), {
                status: "completed",
            });

            setEvents((prev) =>
                prev.map((e) =>
                    e.id === data.id
                        ? {
                            ...e,
                            status: "completed",
                        }
                        : e
                )
            );

            bottomSheetRef.current.close();
            setSelectedEvent(null)
        } catch (error) {
            console.log("Erro ao concluir agendamento:", error);
        }
    }

    async function handlePressonReactivate(data) {

        try {
            await updateDoc(doc(db, "scheduling", data.id), {
                status: "scheduled",
            });

            setEvents((prev) =>
                prev.map((e) =>
                    e.id === data.id
                        ? {
                            ...e,
                            status: "scheduled",
                        }
                        : e
                )
            );

            bottomSheetRef.current.close();
            setSelectedEvent(null)
        } catch (error) {
            console.log("Erro ao reativar agendamento:", error);
        }
    }

    async function getServices() {
        try {
            const getServicesData = await getDocs(collection(db, "services"))
            setServices(getServicesData.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
        } catch (error) {
            console.log("Erro ao buscar serviços:", error);
        }
    }

    const renderEvent = useCallback((event) => {

        const isOverdue =
            event.status === "scheduled" &&
            new Date(event.end.dateTime) < new Date();

        const backgroundColor =
            isOverdue
                ? COLORS.red
                : event.status === "cancelled"
                    ? COLORS.gray
                    : event.status === "completed"
                        ? COLORS.green
                        : COLORS.primary;

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor,
                    borderRadius: 8,
                    padding: 4,
                    justifyContent: "center",
                }}
            >
                <Text style={{ color: COLORS.white }}>
                    {event.title}
                </Text>
            </View>
        );
    }, []);

    return {
        events,
        selectedEvent,
        bottomSheetRef,
        isEditing,
        methods,
        services,

        handlers: {
            handleDragCreateStart,
            handleDragCreateEnd,
            handleDragStart,
            handleDragEnd,
            handleEditScheduling,
            getSchedulingById,
            handleCreateScheduling,
            handlePressCancel,
            handlePressCompleted,
            handlePressonReactivate

        },

        renderEvent,
    }
}
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { formScheduling } from "../../../schemas/schedulingSchema";
import { v4 as uuidv4 } from 'uuid';
import { COLORS } from "../../../constants/colors";
import { DraggingEvent } from "@howljs/calendar-kit";
import { Text, View } from "react-native";
import { is } from "zod/locales";

export const CLIENTS = [
    { label: "Laís Kaminski Casagrande", value: "1" },
    { label: "João Silva", value: "2" },
    { label: "Maria Souza", value: "3" },
];

export function useScheduling() {

    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [idEvent, setIdEvent] = useState(null)
    const [isEditing, setIsEditing] = useState(false)

    const bottomSheetRef = useRef(null);

    const methods = useForm({
        resolver: zodResolver(formScheduling),
        defaultValues: {
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
        console.log(event)
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

    function onSubmit(data) {
        console.log("data: ", data)

        const selectedClient = CLIENTS.find(
            (client) => client.value === data.client
        );
        const status = methods.watch("status")

        const formattedEvent = {
            id: idEvent || uuidv4(),
            client: data.client,
            service: data.service,
            title: selectedClient?.label || "",
            start: {
                dateTime: data.dateStart.toISOString(),
                timeZone: "local",
            },
            end: {
                dateTime: data.dateEnd.toISOString(),
                timeZone: "local",
            },
            status: status,
        }

        setEvents((prev) =>
            idEvent ? prev.map((e) =>
                e.id === idEvent
                    ? {
                        ...e,
                        ...formattedEvent
                    }
                    : e
            )
                : [...prev, formattedEvent]
        )

        bottomSheetRef.current.close()
        setIdEvent(null)
        setSelectedEvent(null)
        methods.reset({
            client: "",
            service: "",
            dateStart: new Date(),
            dateEnd: new Date(),
            status: "scheduled"
        })
    }

    function handlePressCancel() {

        setEvents((prev) =>
            prev.map((e) =>
                e.id === idEvent
                    ? {
                        ...e,
                        status: "cancelled"
                    }
                    : e
            )
        )

        bottomSheetRef.current.close()
        setSelectedEvent(null)
    }

    function handlePressCompleted() {

        setEvents((prev) =>
            prev.map((e) =>
                e.id === idEvent
                    ? {
                        ...e,
                        status: "completed",
                    }
                    : e
            )
        );

        bottomSheetRef.current.close();
        setSelectedEvent(null)
    }

    function handlePressonReactivate(){

        setEvents((prev) =>
            prev.map((e) =>
                e.id === idEvent
                    ? {
                        ...e,
                        status: "scheduled",
                    }
                    : e
            )
        );

        bottomSheetRef.current.close();
        setSelectedEvent(null)
    }

    function handlePressEvent(event) {
        setIsEditing(true)
        setSelectedEvent(event)
        const status = methods.watch("status")

        const start = new Date(event.start.dateTime)
        const end = new Date(event.end.dateTime)

        methods.reset({
            client: event.client,
            service: event.service,
            dateStart: start,
            dateEnd: end,
            status: event.status
        })

        setIdEvent(event.id)

        bottomSheetRef.current.expand()
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

        handlers: {
            handleDragCreateStart,
            handleDragCreateEnd,
            handleDragStart,
            handleDragEnd,
            handlePressEvent,
            onSubmit,
            handlePressCancel,
            handlePressCompleted,
            handlePressonReactivate

        },

        renderEvent,
    }
}
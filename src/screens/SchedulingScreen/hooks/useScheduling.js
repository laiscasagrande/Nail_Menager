import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { formScheduling } from "../../../schemas/schedulingSchema";
import { v4 as uuidv4 } from 'uuid';
import { COLORS } from "../../../constants/colors";
import { DraggingEvent } from "@howljs/calendar-kit";
import { View } from "react-native";

export const CLIENTS = [
    { label: "Laís Kaminski Casagrande", value: "1" },
    { label: "João Silva", value: "2" },
    { label: "Maria Souza", value: "3" },
];

export function useScheduling() {

    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [idEvent, setIdEvent] = useState(null)

    const bottomSheetRef = useRef(null);

    const methods = useForm({
        resolver: zodResolver(formScheduling),
        defaultValues: {
            client: "",
            service: "",
            dateStart: new Date(),
            dateEnd: new Date(),
        },
    })

    const handleDragCreateStart = (start) => {
        console.log("começou:", start);
    };

    const handleDragCreateEnd = (event) => {
        if (!event) return;

        bottomSheetRef.current.expand();

        const createdEvent = {
            ...event,
            id: uuidv4(),
            title: "",
            color: COLORS.primary,
        };

        methods.reset({
            client: "",
            service: "",
            dateStart: new Date(event.start.dateTime),
            dateEnd: new Date(event.end.dateTime),
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

        const selectedClient = CLIENTS.find(
            (client) => client.value === data.client
        );

        const formattedEvent = {
            id: idEvent || uuidv4(),
            client: data.client,
            service: data.service,
            title: selectedClient?.label || "",
            color: COLORS.primary,
            start: {
                dateTime: data.dateStart.toISOString(),
                timeZone: "local",
            },
            end: {
                dateTime: data.dateEnd.toISOString(),
                timeZone: "local",
            }
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
        methods.reset()
    }

    function handlePressEvent(event) {
        setSelectedEvent(event)

        const start = new Date(event.start.dateTime)
        const end = new Date(event.end.dateTime)

        methods.reset({
            client: event.client,
            service: event.service,
            dateStart: start,
            dateEnd: end
        })

        setIdEvent(event.id)

        bottomSheetRef.current.expand()
    }

    const renderDraggingEvent = useCallback((props) => {
        return (
            <DraggingEvent
                {...props}
                TopEdgeComponent={
                    <View
                        style={{
                            height: 10,
                            width: "100%",
                            backgroundColor: COLORS.primary,
                            position: "absolute",
                        }}
                    />
                }
                BottomEdgeComponent={
                    <View
                        style={{
                            height: 10,
                            width: "100%",
                            backgroundColor: COLORS.primary,
                            bottom: 0,
                            position: "absolute",
                        }}
                    />
                }
            />
        );
    }, []);

    return {
        events,
        selectedEvent,
        bottomSheetRef,
        methods,

        handlers: {
            handleDragCreateStart,
            handleDragCreateEnd,
            handleDragStart,
            handleDragEnd,
            handlePressEvent,
            onSubmit,
        },

        renderDraggingEvent,
    }
}
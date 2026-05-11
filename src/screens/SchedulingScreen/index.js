import React, { useCallback, useRef, useState } from "react";
import {
    CalendarContainer,
    CalendarHeader,
    CalendarBody,
    DraggingEvent,
} from "@howljs/calendar-kit";
import FormSheetScheduling from "./components/FormSheetScheduling";
import { COLORS } from "../../constants/colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import { v4 as uuidv4 } from 'uuid';
import { formScheduling } from "../../schemas/schedulingSchema";

export default function SchedulingScreen() {

    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const bottomSheetRef = useRef(null);
    const [idEvent, setIdEvent] = useState(null)

    const methods = useForm({
        resolver: zodResolver(formScheduling),
        defaultValues: {
            event: "",
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
            event: "",
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
        console.log(data)
        setEvents((prev) =>
            prev.map((e) =>
                e.id === idEvent
                    ? {
                        ...e,
                        title: data.event,
                        start: {
                            dateTime: data.dateStart.toISOString(),
                            timeZone: "local",
                        },
                        end: {
                            dateTime: data.dateEnd.toISOString(),
                            timeZone: "local",
                        },
                    }
                    : e
            )
        )
        bottomSheetRef.current.close()
        setIdEvent("")
        setSelectedEvent(null)
        methods.reset()
    }

    function handlePressEvent(event) {
        setSelectedEvent(event)

        const start = new Date(event.start.dateTime)
        const end = new Date(event.end.dateTime)

        methods.reset({
            event: event.title,
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

    return (
        <>
            <CalendarContainer
                events={events}
                scrollByDay
                allowDragToCreate
                allowDragToEdit
                dragStep={15}
                selectedEvent={selectedEvent}
                onPressEvent={(event) => handlePressEvent(event)}
                onDragCreateEventStart={handleDragCreateStart}
                onDragCreateEventEnd={handleDragCreateEnd}
                onDragSelectedEventStart={handleDragStart}
                onDragSelectedEventEnd={handleDragEnd}
            >
                <CalendarHeader />

                <CalendarBody
                    renderDraggingEvent={renderDraggingEvent}
                />

                <FormProvider {...methods}>
                    <FormSheetScheduling
                        bottomSheetRef={bottomSheetRef}
                        onSubmit={onSubmit}
                    />
                </FormProvider>

            </CalendarContainer>
        </>
    );
} 
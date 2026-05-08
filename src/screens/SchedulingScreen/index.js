import React, { useCallback, useRef, useState } from "react";
import {
    CalendarContainer,
    CalendarHeader,
    CalendarBody,
    DraggingEvent,
} from "@howljs/calendar-kit";
import FormSheetScheduling from "./components/FormSheetScheduling";
import { COLORS } from "../../constants/colors";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { View } from "react-native";

export default function SchedulingScreen() {

    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [dateStart, setDateStart] = useState(new Date());
    const [dateEnd, setDateEnd] = useState(new Date());

    const bottomSheetRef = useRef(null);
    const [idEvent, setIdEvent] = useState("")

    const formScheduling = z.object({
        dateStart: z.date(),
        dateEnd: z.date(),
        event: z.string({ message: "campo obrigatório" }).min(3)
    })


    const methods = useForm({
        resolver: zodResolver(formScheduling),
        defaultValues: {
            event: "",
            dateStart: dateStart,
            dateEnd: dateEnd,
        },
    })

    const handleDragCreateStart = (start) => {
        console.log("começou:", start);
    };

    const handleDragCreateEnd = (event) => {
        if (!event) return;
        methods.reset()

        bottomSheetRef.current.expand();

        setEvents((prev) => {

            const createdEvent = {
                ...event,
                id: Math.random(),
                title: "",
                color: COLORS.primary,
            };

            setDateStart(new Date(event.start.dateTime));
            setDateEnd(new Date(event.end.dateTime));
            setIdEvent(createdEvent.id)

            return [...prev, createdEvent];
        });
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
        console.log("submit chamou")
        console.log(data)
        setEvents((prev) =>
            prev.map((e) =>
                e.id === idEvent
                    ? {
                        ...e,
                        title: data.event,
                        start: {
                            dateTime: dateStart.toISOString(),
                            timeZone: "local",
                        },
                        end: {
                            dateTime: dateEnd.toISOString(),
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

        setDateStart(start)
        setDateEnd(end)

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

                <FormSheetScheduling
                    setDateStart={setDateStart}
                    dateStart={dateStart}
                    setDateEnd={setDateEnd}
                    dateEnd={dateEnd}
                    bottomSheetRef={bottomSheetRef}
                    methods={methods}
                    onSubmit={onSubmit}
                />

            </CalendarContainer>
        </>
    );
} 
import {
    CalendarBody,
    CalendarContainer,
    CalendarHeader,
    DraggingEvent,
} from "@howljs/calendar-kit";
import React, { useCallback, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/colors";
import FormSheet from "../../components/FormSheet";
import { Button, TextInput } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function SchedulingScreen() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = React.useState("");
    const [date, setDate] = useState(new Date());
    const bottomSheetRef = useRef(null)

    const handleDragCreateStart = (start) => {
        console.log("começou:", start);
    };

    const handleDragCreateEnd = (event) => {
        if (!event) return;
        bottomSheetRef.current.expand()

        setEvents((prev) => {
            const newEvent = {
                ...event,
                id: Math.random(),
                title: newEvent,
                color: COLORS.primary,
            };

            const updated = [...prev, newEvent];

            return updated;
        });
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
        <CalendarContainer
            events={events}
            scrollByDay
            allowDragToCreate
            allowDragToEdit
            dragStep={15}
            selectedEvent={selectedEvent}
            onPressEvent={(event) => setSelectedEvent(event)}
            onDragCreateEventStart={handleDragCreateStart}
            onDragCreateEventEnd={handleDragCreateEnd}
            onDragSelectedEventStart={handleDragStart}
            onDragSelectedEventEnd={handleDragEnd}
        >
            <CalendarHeader />
            <CalendarBody renderDraggingEvent={renderDraggingEvent} />
            <FormSheet ref={bottomSheetRef}>
                <View style={styles.container}>
                    <View style={styles.dates}>
                        <Pressable style={styles.inputDate}>
                            <Text style={styles.label}>Início</Text>
                            <Text>
                                {date.toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </Text>
                        </Pressable>
                        <Pressable style={styles.inputDate}>
                            <Text style={styles.label}>Fim</Text>
                            <Text>
                                {date.toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </Text>
                        </Pressable>
                    </View>
                    <View>
                        <TextInput
                            label="Novo evento"
                            mode="outlined"
                            value={newEvent}
                            onChangeText={text => setNewEvent(text)}
                            activeOutlineColor={COLORS.primary}
                            outlineColor={COLORS.gray}
                        />
                    </View>
                    <View style={styles.containerButton}>
                        <Button style={styles.button}>
                            <Text style={styles.buttonText}>Salvar</Text>
                        </Button>
                    </View>
                </View>
            </FormSheet>
        </CalendarContainer>
    );
}

const styles = StyleSheet.create({
    dates: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    container: {
        flexDirection: 'column',
        gap: 30,
        justifyContent: 'center'
    },

    inputDate: {
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 3,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        gap: 10
    },

    label: {
        fontSize: 15,
        color: COLORS.primary
    },

    button: {
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        width: 282,
        height: 58,
        alignItems: 'center',
        justifyContent: 'center'
    },

    buttonText: {
        fontSize: 18,
        color: COLORS.white
    },

    containerButton: {
        alignItems: 'center'
    }
})
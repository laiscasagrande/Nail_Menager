import {
  CalendarBody,
  CalendarContainer,
  CalendarHeader,
  DraggingEvent,
} from "@howljs/calendar-kit";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { COLORS } from "../../constants/colors";

export default function SchedulingScreen() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleDragCreateStart = (start) => {
    console.log("começou:", start);
  };

  const handleDragCreateEnd = (event) => {
    if (!event) return;

    setEvents((prev) => {
      const newEvent = {
        ...event, 
        id: Math.random(),
        title: "Novo evento",
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
    </CalendarContainer>
  );
}
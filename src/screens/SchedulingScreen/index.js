import {
    CalendarContainer,
    CalendarHeader,
    CalendarBody
} from "@howljs/calendar-kit";
import FormSheetScheduling from "./components/FormSheetScheduling";
import { useScheduling } from "./hooks/useScheduling";
import { FormProvider } from "react-hook-form";

export default function SchedulingScreen() {

    const {events, selectedEvent, handlers, renderDraggingEvent, bottomSheetRef, methods} = useScheduling()

    return (
        <>
            <CalendarContainer
                events={events}
                scrollByDay
                allowDragToCreate
                allowDragToEdit
                dragStep={15}
                selectedEvent={selectedEvent}
                onPressEvent={(event) => handlers.handlePressEvent(event)}
                onDragCreateEventStart={handlers.handleDragCreateStart}
                onDragCreateEventEnd={handlers.handleDragCreateEnd}
                onDragSelectedEventStart={handlers.handleDragStart}
                onDragSelectedEventEnd={handlers.handleDragEnd}
            >
                <CalendarHeader />

                <CalendarBody
                    renderDraggingEvent={renderDraggingEvent}
                />

                <FormProvider {...methods}>
                    <FormSheetScheduling
                        bottomSheetRef={bottomSheetRef}
                        onSubmit={handlers.onSubmit}
                    />
                </FormProvider>

            </CalendarContainer>
        </>
    );
} 
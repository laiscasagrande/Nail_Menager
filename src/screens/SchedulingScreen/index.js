import {
    CalendarContainer,
    CalendarHeader,
    CalendarBody
} from "@howljs/calendar-kit";
import FormSheetScheduling from "./components/FormSheetScheduling";
import { useScheduling } from "./hooks/useScheduling";
import { FormProvider } from "react-hook-form";
import { useTheme } from "../../context/ThemeContext";

export default function SchedulingScreen() {
    const { theme } = useTheme();
    const {events, selectedEvent, handlers, renderEvent, bottomSheetRef, methods, isEditing, services, clients} = useScheduling()

    return (
        <>
            <CalendarContainer
                events={events}
                theme={{
                    colors: {
                        primary: theme.primary,
                        onPrimary: '#FFFFFF',
                        background: theme.background,
                        onBackground: theme.text,
                        border: theme.border,
                        text: theme.text,
                        surface: theme.card,
                        onSurface: theme.text,
                    },
                }}
                scrollByDay
                allowDragToCreate
                allowDragToEdit
                dragStep={15}
                selectedEvent={selectedEvent}
                onPressEvent={(event) => handlers.getSchedulingById(event.id)}
                onDragCreateEventStart={handlers.handleDragCreateStart}
                onDragCreateEventEnd={handlers.handleDragCreateEnd}
                onDragSelectedEventStart={handlers.handleDragStart}
                onDragSelectedEventEnd={handlers.handleDragEnd}
            >
                <CalendarHeader />

                <CalendarBody
                    renderEvent={renderEvent}
                />

                <FormProvider {...methods}>
                    <FormSheetScheduling
                        bottomSheetRef={bottomSheetRef}
                        services={services}
                        clients={clients} 
                        onSubmit={handlers.handleCreateScheduling}
                        onCancel={handlers.handlePressCancel}
                        onCompleted={handlers.handlePressCompleted}
                        isEditing={isEditing}
                        onReactivate={handlers.handlePressonReactivate}
                        onEdit={handlers.handleEditScheduling}
                    />
                </FormProvider>

            </CalendarContainer>
        </>
    );
} 
import { Calendar } from 'react-native-calendars';

export default function HorariosDisponiveis() {
 
    const hoje = new Date().toISOString().split('T')[0];
 
    return(
        <Calendar
        current= {hoje}

        onDayPress={(day) => {
            console.log("Dia selecionado: ", day.dateString);
        }}

        theme={{
        selectedDayBackgroundColor: '#E91E8C',
        todayTextColor: '#E91E8C',
        arrowColor: '#E91E8C',
        dotColor: '#E91E8C',
      }}
        />
    );
}
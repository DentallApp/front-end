import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import moment from 'moment';
import styles from '../MobileCalendar/AppointmentCalendar.module.css';

const WebCalendar = ({
    events, 
    setAppointmentSelect, 
    handleShow, 
    setEventClassNames,
    startDate,
    endDate
}) => {

    const getStartDate = () => startDate;
    
    const getEndDate = () => moment(endDate).add(1, 'days').format('yyyy-MM-DD');

    return (
        <FullCalendar
        initialView= {'dayGridMonth'}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        headerToolbar={{
            left: 'prev, next, today',
            center: 'title',
            right: 'dayGridMonth, timeGridDay, listDay',
        }}
        height={'100%'}
        locale={esLocale}
        events={events}
        contentHeight="auto"
        expandRows={true}
        handleWindowResize={true}
        stickyHeaderDates={true}
        windowResizeDelay={200}
        eventTimeFormat= {{ // like '14:30:00'
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
        }}
        eventClassNames= {(arg) => setEventClassNames(arg, styles)}
        slotMinTime={'9:00:00'}
        slotMaxTime={'20:30:00'}
        validRange={{
            start: getStartDate(),
            end: getEndDate()
        }}
        eventClick={function(arg) {
            setAppointmentSelect(arg);
            handleShow();
        }}
      />
    );
}

export default WebCalendar;
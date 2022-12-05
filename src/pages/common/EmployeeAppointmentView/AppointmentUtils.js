import moment from 'moment';
import APPOINTMENT_STATUS from 'constants/AppointmentStatus';

export const mappingAppointments = (data) => {
    const newList = data.map(appointment => {
        return {
            id: appointment.appointmentId,
            title: appointment.patientName.split(' ')[0] + ' ' + 
            appointment.patientName.split(' ')[appointment.patientName.split(' ').length === 4 ? 
            appointment.patientName.split(' ').length - 2 : appointment.patientName.split(' ').length - 1],
            start: getDateWithHour(appointment.appointmentDate, appointment.startHour),
            end: getDateWithHour(appointment.appointmentDate, appointment.endHour),
            color: APPOINTMENT_STATUS.filter(status => status.name === appointment.status)[0].colorHex,
            ...appointment
        }
    })

    return newList;
}

const getDateWithHour = (date, hour) => {
    const testDate = moment(date);
    testDate.add(parseInt(hour.split(':')[0]), 'hours');
    testDate.add(parseInt(hour.split(':')[1]), 'minutes');  

    return testDate.format('yyyy-MM-DD HH:mm').toString();
}

export const filterAppointmentByDentist = (dentistId, statusId, appointments) => {

    if(dentistId === 0 && statusId === 0)
        return appointments;
    
    if(dentistId === 0 && statusId !== 0) 
        return appointments.filter(appointment => appointment.statusId === statusId);
    
    if(dentistId !== 0 && statusId === 0)
        return appointments.filter(appointment => appointment.dentistId === dentistId);
    
    if(dentistId !== 0 && statusId !== 0)
        return appointments.filter(appointment => appointment.dentistId === dentistId && appointment.statusId === statusId);
}
export const filterAppointmentByDentist = (dentistId, appointments) => {
    return appointments.filter(appointment => appointment.dentistId === dentistId);
}
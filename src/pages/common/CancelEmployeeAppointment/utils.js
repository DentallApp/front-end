export const filterAppointmentByDentist = (dentistId, appointments) => {
    return appointments.filter(appointment => appointment.dentistId === dentistId);
}

export const mappingAppointmentsForCancel = (appointments) => {
    return appointments.map(appointment => {
        return {
            appointmentId: appointment.appointmentId,
            patientName: appointment.patientName,
            patientCellPhone: appointment.cellPhone,
            appointmentDate: appointment.appointmentDate,
            startHour: appointment.startHour
        }
    })
}
export const filterAppointmentByDentist = (dentistId, appointments) => {
    return appointments.filter(appointment => appointment.dentistId === dentistId);
}

export const mappingAppointmentsForCancel = (appointments) => {
    return appointments.map(appointment => {
        return {
            appoinmentId: appointment.appoinmentId,
            patientName: appointment.patientName,
            patientCellPhone: appointment.cellPhone,
            appoinmentDate: appointment.appointmentDate,
            startHour: appointment.startHour
        }
    })
}
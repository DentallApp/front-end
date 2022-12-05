import api from './Api';

// Obtiene la información para el reporte de citas asistidas, no asistidas y canceladas
export const getReportAppointments = async(data) => {
    return await api.post('/report/appointment', {
        from: data.from,
        to: data.to,
        officeId: data.officeId,
        dentistId: data.dentistId
    })
}

// Obtiene la información para el reporte de citas agendadas
export const getScheduledAppointments = async(data) => {
    return await api.post('/report/appointment/scheduled', {
        from: data.from,
        to: data.to,
        officeId: data.officeId
    })
}

export const getRankingDentalService = async(data) => {
    return await api.post('/report/most-requested/services', {
        from: data.from,
        to: data.to,
        officeId: data.officeId,
    });
}
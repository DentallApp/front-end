import api from './Api';

export const getOffices = async() => {
    return await api.get('/scheduling/office');
}

export const getDentalServices = async() => {
    return await api.get('/scheduling/dental-service');
}

export const getDentistByOfficeAndService = async(officeId, dentalServiceId) => {
    return await api.get('/scheduling/dentist', {
        params: {
            officeId,
            dentalServiceId
        }
    });
}

export const getAvailabilityHours = (data) => {
    return api.post('/appointment/available-hours', {
        officeId: data.officeId,
        dentistId: data.dentistId,
        dentalServiceId: data.dentalServiceId,
        appointmentDate: data.appointmentDate
    })
    .then(res => {
        return {
            data: res.data.data,
            success: res.data.success,
            message: res.data.message,
        }
    })
    .catch(err => {
        if(err.response.status === 0) return {status: err.response.status,}

        return {
            status: err.response.status,
            success: err.response.data.success,
            message: err.response.data.message
        }
    })
}

export const createAppointment = (data) => {
    return api.post('/appointment', {
        userId: data.userId,
        personId: data.personId,
        dentistId: data.dentistId,
        generalTreatmentId: data.generalTreatmentId,
        officeId: data.officeId,
        appointmentDate: data.appointmentDate,
        startHour: data.startHour,
        endHour: data.endHour
    })
    .then(res => {
        return {
            status: res.status,
            success: res.data.success,
            message: res.data.message,
        }
    })
    .catch(err => {
        if(err.response.status === 0) return {status: err.response.status,}

        return {
            status: err.response.status,
            success: err.response.data.success,
            message: err.response.data.message
        }
    })
}
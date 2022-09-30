import api from './Api';

export const getAppointmentDentist = async(startDate, endDate, office, dentist, status) => {
    return await api.post('/appoinment/dentist', {
        from: startDate,
        to: endDate,
        officeId: office,
        dentistId: dentist,
        statusId: status
    })
    .then(res => {
        return {
            data: res.data,
            status: res.status
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

export const updateStatusAppointment = async(statusId, id) => {
    return await api.put(`/appoinment/${id}`, {
        statusId: statusId,
    })
    .then(res => {
        return {
            status: res.status,
            success: res.data.success,
            message: res.data.message
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

export const cancelAppointments = (data) => {
    return api.post('/appoinment/cancel/dentist', {
        reason: data.reason,
        appoinments: data.appoinments
    })
    .then(res => {
        return {
            status: res.status,
            success: res.data.success,
            message: res.data.message
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

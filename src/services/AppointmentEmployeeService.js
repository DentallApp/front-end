import api from './Api';

export const getAppointmentByOffice = async(startDate, endDate) => {
    return await api.post('/appoinment/office', {
        from: startDate,
        to: endDate
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

export const getAllAppointmentByDentist = async(startDate, endDate) => {
    return await api.post('/appoinment/dentist', {
        from: startDate,
        to: endDate
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

export const getScheduledAppointmentByOffice = async(startDate, endDate) => {
    return await api.post('/appoinment/scheduled/office', {
        from: startDate,
        to: endDate
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

export const getScheduledAppointmentByDentist = async(startDate, endDate) => {
    return await api.post('/appoinment/scheduled/dentist', {
        from: startDate,
        to: endDate
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
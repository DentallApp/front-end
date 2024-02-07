import api from './Api';

export const getAllSchedules = async() => {
    return await api.get('/office/overview');
}

export const getScheduleByOfficeId = async(officeId) => {
    return await api.get(`/office-schedule/${officeId}`);
}

export const createSchedule = (data) => {
    return api.post('/office-schedule', {
        weekDayId: data.weekDayId,
        officeId: data.officeId,
        startHour: data.startHour,
        endHour: data.endHour
    })
    .then(res => {
        return {
            data: res.data.data,
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

export const updateSchedule = (data) => {
    return api.put(`/office-schedule/${data.scheduleId}`, {
        weekDayId: data.weekDayId,
        startHour: data.startHour,
        endHour: data.endHour,
        isDeleted: data.isDeleted
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

export const getOfficeHomePage = async() => {
    return await api.get('/office/home-page');
}
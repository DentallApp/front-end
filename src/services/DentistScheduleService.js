import api from './Api';

export const getDentists = async () => {
    return await api.get('/employee/dentist');
}

export const getSchedulesByEmployee = async (id) => {
    return await api.get(`/employee-schedule/${id}`);
}

export const createSchedule = (data) => {
    return api.post('/employee-schedule', {
        weekDayId: data.weekDayId,
        employeeId: data.employeeId,
        morningStartHour: data.morningStartHour,
        morningEndHour: data.morningEndHour,
        afternoonStartHour: data.afternoonStartHour,
        afternoonEndHour: data.afternoonEndHour
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
    return api.put(`/employee-schedule/${data.scheduleId}`, {
        weekDayId: data.weekDayId,
        morningStartHour: data.morningStartHour,
        morningEndHour: data.morningEndHour,
        afternoonStartHour: data.afternoonStartHour,
        afternoonEndHour: data.afternoonEndHour,
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

export const getAllSchedule = async() => {
    return await api.get('/employee/overview');
}
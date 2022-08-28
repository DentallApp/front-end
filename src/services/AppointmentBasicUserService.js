import api from './Api';

export const getAppointments = async () => {
    return await api.get('/appoinment/basic-user');
}

export const deleteAppointment = (id) => {
    return api.delete(`/appoinment/${id}/basic-user`)
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
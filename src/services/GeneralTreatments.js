import api from './Api';

export const getGeneralTreatment = async () => {
    let result = await api.get('/general-treatment');
    return result;
}

export const getGeneralTreatmentXId = async (id) => {
    let result = await api.get(`/general-treatment/${id}`);
    return result;
}

export const getGeneralTreatmentEdit = async () => {
    return await api.get('/general-treatment/edit');
}

export const createTreatment = (data) => {
    return api.post('/general-treatment', data, { headers: {"Content-Type": "multipart/form-data"} })
    .then(res => {
        return {
            success: res.data.success,
            message: res.data.message
        }
    })
    .catch(err => {
        return {
            success: err.response.data.success,
            message: err.response.data.message
        }
    })
}

export const updateTreatment = (data, id) => {
    return api.put(`/general-treatment/${id}`, data)
    .then(res => {
        return {
            success: res.data.success,
            message: res.data.message
        }
    })
    .catch(err => {
        return {
            success: err.response.data.success,
            message: err.response.data.message
        }
    })
}

export const deleteTreatment = (id) => {
    return api.delete(`/general-treatment/${id}`)
    .then(res => {
        return {
            success: res.data.success,
            message: res.data.message
        }
    })
    .catch(err => {
        return {
            success: err.response.data.success,
            message: err.response.data.message
        }
    })
}
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
            message: err.response.data.message,
            errors: err.response.data.errors
        }
    })
}

export const updateTreatment = (data, id) => {
    return api.put(`/general-treatment/${id}`, data)
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
            message: err.response.data.message,
            errors: err.response.data.errors
        }
    })
}

export const deleteTreatment = (id) => {
    return api.delete(`/general-treatment/${id}`)
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

export const getGeneralTreatmentName = async() => {
    return await api.get('/general-treatment/name');
}
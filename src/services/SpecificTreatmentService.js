import api from './Api';

export const getSpecificTreatment = async() => {
    return await api.get('/specific-treatment');
}

export const createSpecificTreatment = (data) => {
    return api.post('/specific-treatment', {
        name: data.name,
        generalTreatmentId: data.generalTreatmentId,
        price: data.price
    })
    .then(res => {
        if(res.data.success === true) {
            return {
                data: res.data.data,
                status: res.status,
                success: res.data.success,
                message: res.data.message
            }
        }
    })
    .catch(err => {
        if(err.response.status === 0) return {status: err.response.status,}
        
        return {
            status: err.response.status,
            success: err.response.data.success,
            message: err.response.data.message
        };
    })
}

export const updateSpecificTreatment = (data) => {
    return api.put(`/specific-treatment/${data.specificTreatmentId}`, {
        name: data.name,
        generalTreatmentId: data.generalTreatmentId,
        price: data.price
    })
    .then(res => {
        if(res.data.success === true) {
            return {
                status: res.status,
                success: res.data.success,
                message: res.data.message
            }
        }
    })
    .catch(err => {
        if(err.response.status === 0) return {status: err.response.status,}
        
        return {
            status: err.response.status,
            success: err.response.data.success,
            message: err.response.data.message
        };
    })
}

export const deleteSpecificTreatment = (id) => {
    return api.delete(`/specific-treatment/${id}`)
    .then(res => {
        if(res.data.success === true) {
            return {
                status: res.status,
                success: res.data.success,
                message: res.data.message
            }
        }
    })
    .catch(err => {
        if(err.response.status === 0) return {status: err.response.status,}
        
        return {
            status: err.response.status,
            success: err.response.data.success,
            message: err.response.data.message
        };
    })
}
import api from './Api';

export const getDependents = async () => {
    return await api.get('/dependent/user');
}

export const createDependent = (data) => {
    return api.post('/dependent', {
        names: data.names,
        lastNames: data.lastNames,
        cellPhone: data.cellPhone,
        dateBirth: data.dateBirth,
        genderId: data.genderId,
        email: data.email,
        document: data.document,
        kinshipId: data.kinshipId
    })
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

export const updateDependent = (data) => {
    return api.put(`/dependent/${data.dependentId}`, {
        names: data.names,
        lastNames: data.lastNames,
        cellPhone: data.cellPhone,
        dateBirth: data.dateBirth,
        genderId: data.genderId,
        email: data.email,
        kinshipId: data.kinshipId
    })
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

export const deleteDependent = (id) => {
    return api.delete(`/dependent/${id}`)
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
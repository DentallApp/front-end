import api from './Api';

export const createPerson = (data) => {
    return api.post('/person', {
        names: data.names,
        lastNames: data.lastNames,
        document: data.document,
        cellPhone: data.cellPhone,
        dateBirth: data.dateBirth,
        genderId: data.genderId,
        email: data.email
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

export const searchPerson = async(value) => {
    return await api.get(`/person/search?value=${value}`);
}
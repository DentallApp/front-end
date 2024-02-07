import api from './Api';

export const getOffices = async() => {
    return await api.get('/office/name?status=true');
}

export const getAllOffices = async() => {
    return await api.get('/office/edit');
}

export const createOffice = (data) => {
    return api.post('/office', {
        name: data.name,
        address: data.address,
        contactNumber: data.contactNumber
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

export const updateOffice = (data) => {
    return api.put(`/office/${data.id}`, {
        name: data.name,
        address: data.address,
        contactNumber: data.contactNumber,
        isDeleted: data.isDeleted,
        isCheckboxTicked: data.isCheckboxTicked
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

export const getOfficesActiveAndInactive = async() => {
    return await api.get('/office/name');
}
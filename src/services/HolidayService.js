import api from './Api';

export const getHolidays = async () => {
    let result = await api.get('/public-holiday');
    return result;
}

export const createHoliday = (data) => {
    return api.post('/public-holiday', {
        ...data
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
        }
    })
}

export const editHoliday = (data) => {
    return api.put(`/public-holiday/${data.id}`, {
        ...data
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
        }
    })
}

export const deleteHoliday = (id) => {
    return api.delete(`/public-holiday/${id}`)
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
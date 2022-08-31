import api from './Api';

export const getAllDentist = async () => {
    return await api.get('/favorite-dentist/dentist');
}

export const getFavoriteDentist = async () => {
    return await api.get('/favorite-dentist');
}

export const addFavoriteDentist = (dentistId) => {
    return api.post('/favorite-dentist', {
        dentistId
    }).then(res => {
        return {
            status: res.status,
            success: res.data.success,
            message: res.data.message
        };
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

export const removeFavoriteDentist = (dentistId) => {
    return api.delete(`/favorite-dentist/dentist/${dentistId}`)
    .then(res => {
        return {
            status: res.status,
            success: res.data.success,
            message: res.data.message
        };
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

export const removeFavoriteByFavoriteId = (id) => {
    return api.delete(`/favorite-dentist/${id}`)
    .then(res => {
        return {
            status: res.status,
            success: res.data.success,
            message: res.data.message
        };
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
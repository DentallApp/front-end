import api from './Api';

export const setLocalAccessToken = (token) => {
    localStorage.setItem('accessToken', token);
}

export const getLocalAccessToken = () => {
    return localStorage.getItem('accessToken');
}

export const updateLocalAccessToken = (token) => {
    localStorage.setItem('accessToken', token);
}

export const removeLocalAccessToken = () => {
    localStorage.removeItem('accessToken');
}

export const setLocalRefreshToken = (token) => {
    localStorage.setItem('refreshToken', token);
}

export const getLocalRefreshToken = () => {
    return localStorage.getItem('refreshToken');
}

export const updateLocalRefreshToken = (token) => {
    localStorage.setItem('refreshToken', token);
}

export const removeLocalRefreshToken = () => {
    localStorage.removeItem('refreshToken');
}

export const revokeToken = () => {
    return api.post('/token/revoke').then(res => {
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
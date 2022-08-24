
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
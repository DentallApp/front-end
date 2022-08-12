import api from './Api';

export const setLocalUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
}

export const getLocalUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    return user;
}

export const getLocalRefreshToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.refreshToken;
}

export const getLocalAccessToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.accessToken;
}

export const updateLocalAccessToken = (token) => {
    let user = JSON.parse(localStorage.getItem("user"));
    user.accessToken = token;
    localStorage.setItem("user", JSON.stringify(user));
}

export const updateLocalRefreshToken = (token) => {
    let user = JSON.parse(localStorage.getItem("user"));
    user.refreshToken = token;
    localStorage.setItem("user", JSON.stringify(user));
}

export const removeLocalUser = () => {
    localStorage.removeItem("user");
}

export const registerBasicUser = (data) => {
    return api.post('/register/basic-user', {
        ...data
    })
    .then(res => {
        if(res.data.success === true) {
            return {
                success: res.data.success,
                message: res.data.message
            };
        }
    })
    .catch(err => {
        return {
            success: err.response.data.success,
            message: err.response.data.message
        };
    })
}

export const updateProfileUser = (data) => {
    return api.put('/user', {
        names: data.names,
        lastNames: data.lastNames,
        cellPhone: data.cellPhone,
        dateBirth: data.dateBirth,
        genderId: data.genderId
    })
    .then(res => {
        if(res.data.success === true) {
            return {
                success: res.data.success,
                message: res.data.message
            }
        }
    })
    .catch(err => {
        return {
            success: err.response.data.success,
            message: err.response.data.message
        }
    })
}

export const updatePassword = ({ oldPassword, newPassword }) => {
    return api.put('/user/password', {
        oldPassword,
        newPassword
    })
    .then(res => {
        if(res.data.success === true) {
            return {
                success: res.data.success,
                message: res.data.message
            }
        }
    })
    .catch(err => {
        return {
            success: err.response.data.success,
            message: err.response.data.message
        }
    })
}
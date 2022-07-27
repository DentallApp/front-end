import api from './Api';

export const setLocalUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
}

export const getLocalUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user;
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
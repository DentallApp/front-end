import api from './Api';

export const sendUserEmail =(email) => {
    return api.post('/password-reset/send', {email})        
    .then(res => {
                if(res.data.success === true) {
                    return {
                        sucess: res.data.success,
                        message: res.data.message
                    }
                } 
            })
    .catch(err => {
        return {
            success: err.response.data.success,
            message: err.response.data.message
        }
    });
}

export const resetPassword = (newPassword, token) => {
    return api.post('/password-reset', {token, newPassword})
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
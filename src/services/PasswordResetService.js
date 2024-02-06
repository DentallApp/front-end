import api from './Api';

export const sendUserEmail =(email) => {
    return api.post('/user/password-reset/send', {email})        
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
    });
}

export const resetPassword = (newPassword, token) => {
    return api.post('/user/password-reset', {token, newPassword})
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
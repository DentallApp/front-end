import api from './Api';
import { setLocalUser } from './UserService';

export const emailVerification = (token) => {
    return api.get('/email-verification', { params: { token: token } })
            .then(res => {
                console.log("Test: " + res.data);
                if(res.data.success) 
                    setLocalUser({...res.data.data});
                return {
                    success: res.data.success,
                    message: res.data.message
                }
            })
            .catch(err => {
                return {
                    success: err.response.success,
                    message: err.response.message
                }
            });
}
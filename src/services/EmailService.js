import api from './Api';
import { setLocalUser } from './UserService';

export const emailVerification = (token) => {
    return api.post('/email-verification', { token })
            .then(res => {
                if(res.data.success) 
                    setLocalUser({...res.data.data});
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
            });
}
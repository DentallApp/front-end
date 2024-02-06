import api from './Api';
import { setLocalUser } from './UserService';
import { setLocalAccessToken, setLocalRefreshToken } from './TokenService';

export const emailVerification = (token) => {
    return api.post('/user/email-verification', { token })
            .then(res => {
                if(res.data.success) {
                    setLocalAccessToken(res.data.data.accessToken);
                    setLocalRefreshToken(res.data.data.refreshToken);
                    delete res.data.data.accessToken;
                    delete res.data.data.refreshToken;
                    setLocalUser({...res.data.data});
                }
           
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
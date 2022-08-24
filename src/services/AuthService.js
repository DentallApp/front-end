import api from './Api';
import { removeLocalUser, setLocalUser } from './UserService';
import { 
    setLocalAccessToken, 
    setLocalRefreshToken, 
    removeLocalAccessToken, 
    removeLocalRefreshToken 
} from './TokenService';

export const login = ({ userName, password }) => {
    
    return api.post('/login', {
        userName,
        password
    }).then(res => {
        if(res.data.success) {
            setLocalAccessToken(res.data.data.accessToken);
            setLocalRefreshToken(res.data.data.refreshToken);

            delete res.data.data.accessToken;
            delete res.data.data.refreshToken;
            
            setLocalUser({...res.data.data});
        }
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

export const logout = () => {
    removeLocalAccessToken();
    removeLocalRefreshToken();
    removeLocalUser();
}
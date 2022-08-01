import api from './Api';
import { removeLocalUser, setLocalUser } from './UserService';

export const login = ({ userName, password }) => {
    
    return api.post('/login', {
        userName,
        password
    }).then(res => {
        if(res.data.success) 
            setLocalUser({...res.data.data});
        return {
            success: res.data.success,
            message: res.data.message
        };
    })
    .catch(err => {
        console.log(err);
        return {
            success: err.response.data.success,
            message: err.response.data.message
        };
    })
}

export const logout = () => {
    removeLocalUser();
}
import api from './Api';

export const getGenders = async () => {
    return await api.get('/gender');
}
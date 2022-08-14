import api from './Api';

export const getOffices = async() => {
    return await api.get('/office');
}
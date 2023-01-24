import api from './Api';

export const getDirectLineToken = async () => {
    return await api.get('/directline/token');
}
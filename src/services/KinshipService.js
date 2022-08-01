import api from './Api';

export const getKinship = async () => {
    return await api.get('/kinship');
}
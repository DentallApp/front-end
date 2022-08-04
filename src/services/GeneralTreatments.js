import api from './Api';

export const getGeneralTreatment = async () => {
    let result = await api.get('/general-treatment');
    return result;
}

export const getGeneralTreatmentXId = async (id) => {
    let result = await api.get(`/general-treatment/${id}`);
    return result;
}

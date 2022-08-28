import api from './Api';

export const getAppointments = async () => {
    return await api.get('/appoinment/basic-user');
}
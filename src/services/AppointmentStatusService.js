import api from './Api';

export const getAppointmentStatus = async() => {
    return await api.get('/appoinment-status');
 }
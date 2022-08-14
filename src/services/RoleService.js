import api from './Api';

export const getRoles = async (isSuperadmin) => {
    return await api.get(`/role/${isSuperadmin}`)
}
import api from './Api';

export const getEmployee = async () => {
    return await api.get('/employee/edit');
}

export const createEmployee = (data) => {
    return api.post('/employee', {
        document: data.document,
        names: data.names,
        lastNames: data.lastNames,
        cellPhone: data.cellPhone,
        dateBirth: data.dateBirth,
        genderId: data.genderId,
        userName: data.email,
        password: data.password,
        officeId: data.officeId,
        pregradeUniversity: data.pregradeUniversity,
        postgradeUniversity: data.postgradeUniversity,
        roles: data.roles,
        specialtiesId: data.specialtiesId
    })
    .then(res => {
        if(res.data.success === true) {
            return {
                data: res.data.data,
                status: res.status,
                success: res.data.success,
                message: res.data.message
            }
        }
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

export const updateEmployee = (data) => {
    return api.put(`/employee/${data.employeeId}`, {
        document: data.document,
        names: data.names,
        lastNames: data.lastNames,
        cellPhone: data.cellPhone,
        dateBirth: data.dateBirth,
        genderId: data.genderId,
        email: data.email,
        password: data.password,
        officeId: data.officeId,
        isDeleted: data.isDeleted,
        pregradeUniversity: data.pregradeUniversity,
        postgradeUniversity: data.postgradeUniversity,
        roles: data.roles,
        specialtiesId: data.specialtiesId
    })
    .then(res => {
        if(res.data.success === true) {
            return {
                status: res.status,
                success: res.data.success,
                message: res.data.message
            }
        }
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

export const deleteEmployee = (id) => {
    return api.delete(`/employee/${id}`)
    .then(res => {
        if(res.data.success === true) {
            return {
                status: res.status,
                success: res.data.success,
                message: res.data.message
            }
        }
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

export const updateProfileEmployee = (data) => {
    return api.put('/employee', {
        names: data.names,
        lastNames: data.lastNames,
        cellPhone: data.cellPhone,
        dateBirth: data.dateBirth,
        genderId: data.genderId,
        pregradeUniversity: data.pregradeUniversity,
        postgradeUniversity: data.postgradeUniversity,
    })
    .then(res => {
        if(res.data.success === true) {
            return {
                status: res.status,
                success: res.data.success,
                message: res.data.message
            }
        }
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

export const getDentistByOffice = async(officeId, isDentistDeleted) => {
    return await api.post('/employee/dentist', {
        officeId,
        isDentistDeleted
    });
}
import api from './Api';

export const downloadReportAppointment = (data) => {
    return api.post('/pdf/report/appointment', {
        from: data.from,
        to: data.to,
        officeName: data.officeName,
        dentistName: data.dentistName,
        totals: data.totals
    }, {responseType: 'blob'})
    .then(res => {
        if(res.status === 200) {
            return {
                status: res.status,
                data: res.data,
            }
        }
    })
    .catch(err => {
        return {
            status: err.response.status,
        };
    })
}

export const downloadReportScheduledAppointment = (data) => {
    return api.post('/pdf/report/appointment/scheduled', {
        from: data.from,
        to: data.to,
        appointments: data.appointments
    }, {responseType: 'blob'})
    .then(res => {
        if(res.status === 200) {
            return {
                status: res.status,
                data: res.data,
            }
        }
    })
    .catch(err => {
        return {
            status: err.response.status,
        };
    })
}

export const downloadReportMostRequestServices = (data) => {
    return api.post('/pdf/report/most-requested/services', {
        from: data.from,
        to: data.to,
        officeName: data.officeName,
        services: data.services
    }, {responseType: 'blob'})
    .then(res => {
        if(res.status === 200) {
            return {
                status: res.status,
                data: res.data,
            }
        }
    })
    .catch(err => {
        return {
            status: err.response.status,
        };
    })
}
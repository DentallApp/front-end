import api from './Api';

export const downloadReportAppointment = (data) => {
    return api.post('/pdf/report/appoinment', {
        from: data.from,
        to: data.to,
        appoinments: data.appoinments
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
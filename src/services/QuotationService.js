import api from './Api';

export const downloadQuotationPDF = (data) => {
    return api.post('/proforma-invoice/pdf',{
        fullName: data.fullName,
        document: data.document,
        dateIssue: data.dateIssue,
        totalPrice: data.totalPrice,
        dentalTreatments: data.dentalTreatments
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
import { UNEXPECTED_ERROR } from '../constants/InformationMessage';

export const handleErrors = (result, setAlert, setIsLoading) => {
    if(result.success === undefined && (result.status === 0 || result.status === 400 || 
        result.status === 403 ||
        result.status === 404 || result.status === 405 ||
        result.status === 500)) {
        setAlert({success: false, message: UNEXPECTED_ERROR});
        setIsLoading({success: false});
    }
}

export const handleErrorLoading = (err, setErrorLoading) => {
    if((err.response?.status === 0 && err.response?.data === undefined) || 
            (err.response?.data.success === undefined && (err.response?.status === 400 ||
            err.response?.status === 403
            || err.response?.status === 405 ||
            err?.status === 500))) {
            setErrorLoading({success: true, message: UNEXPECTED_ERROR});
            return;
    }  
    setErrorLoading({success: true, message: err.response?.data.message ?? UNEXPECTED_ERROR});
}

import { useState, useEffect } from 'react';
import GeneralTreamentsContext from './GeneralTreamentsContext';
import { getGeneralTreatment } from '../services/generalTreatments';

const GeneralTreamentsProvider = ({ children }) => {
    const [generalTreatments, setGeneralTreatments] = useState(null);

    useEffect(()=> {
        getGeneralTreatment().then((response) => {
            setGeneralTreatments(response.data.data);
        });
    }, [setGeneralTreatments]);

    const generalTreatmentsAdd = (services) => {
        setGeneralTreatments(services);
    }

    const getGeneralTreatmentAll = () => {
        return generalTreatments;
    }

    const findGeneralTreatments = (id) => {
        return generalTreatments.filter(service => service.id === id)
    }

    return (
        <GeneralTreamentsContext.Provider
            value={{
                generalTreatmentsAdd,
                findGeneralTreatments,
                getGeneralTreatmentAll,
                generalTreatments
            }}
        >
            {children}
        </GeneralTreamentsContext.Provider>
    );
}

export default GeneralTreamentsProvider;
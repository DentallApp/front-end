import { useState, useEffect } from 'react';
import GeneralTreamentsContext from './GeneralTreamentsContext';
import { getGeneralTreatment } from 'services/GeneralTreatments';

const GeneralTreamentsProvider = ({ children }) => {
    const [generalTreatments, setGeneralTreatments] = useState(null);

    useEffect(()=> {
        getGeneralTreatment().then((response) => {
            setGeneralTreatments(response.data);
        });
    }, []);

    const getGeneralTreatmentAll = () => {
        return generalTreatments;
    }

    return (
        <GeneralTreamentsContext.Provider
            value={{
                getGeneralTreatmentAll,
                generalTreatments
            }}
        >
            {children}
        </GeneralTreamentsContext.Provider>
    );
}

export default GeneralTreamentsProvider;
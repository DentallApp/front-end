import { useState, useEffect } from 'react';
import { DentistTable, FilterOffice } from './components';
import { AlertMessage, ModalLoading } from '../../../components';
import data from './data';
import styles from './MedicalDirectoryPage.module.css';

const MedicalDirectoryPage = () => {

    const [selectOffice, setSelectOffice] = useState(null);
    const [dentists, setDentists] = useState(null);

    // Estado para el mensaje de alerta
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        setDentists(data);
    }, []);

    return (
        <>
            <h1 className={styles.page_title}>Directorio de Odontólogos</h1>
            { /* Mensaje de alerta para mostrar información al usuario */
                alert && 
                <div className={styles.container_alert}>
                    <AlertMessage 
                    type={ alert.success === false ? 'danger' : 'success' }
                    message={ alert.message }
                    setError= { setAlert }  /> 
                </div>
            }

            <div className={styles.container_header}>
                <FilterOffice setSelectOffice={setSelectOffice} />
            </div>
            
            <DentistTable 
            dentists={data}
            setAlert={setAlert}
            />
        </>
    );
}

export default MedicalDirectoryPage;
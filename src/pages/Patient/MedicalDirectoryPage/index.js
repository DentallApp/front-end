import { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { DentistTable, FilterOffice } from './components';
import { AlertMessage, ModalLoading } from '../../../components';
import { getAllDentist } from '../../../services/FavoriteDentistService';
import styles from './MedicalDirectoryPage.module.css';

const MedicalDirectoryPage = () => {

    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});
    const [selectOffice, setSelectOffice] = useState("0");
    const [dentists, setDentists] = useState(null);
    const [filterDentits, setFilterDentists] = useState(null);
    const [isChange, setIsChange] = useState(false);

    // Estado para el mensaje de alerta
    const [alert, setAlert] = useState(null);

    // Estado para el modal de carga 
    const [isLoading, setIsLoading] = useState(null);

    useEffect(() => {
        getAllDentist().then(res => {
            if(selectOffice === '0') {
                setDentists(res.data);
                setFilterDentists(res.data);
            }
            else {
                const dataDentist = res.data.filter(dentist => dentist.officeId === parseInt(selectOffice));
                setDentists(dataDentist);
                setFilterDentists(dataDentist);
            }
        })
        .catch(err => handleErrorLoading(err));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isChange]);

    const handleErrorLoading = (err) => {
        if((err.response.status === 0 && err.response.data === undefined) || 
                (err.response.data.success === undefined && (err.response.status === 400 
                || err.response.status === 405 ||
                err.status === 500))) {
                setErrorLoading({success: true, message: 'Error inesperado. Refresque la página o intente más tarde'});
                return;
        }  
        setErrorLoading({success: true, message: err.response.data.message});
    }

    return (
        <>
            { isLoading ? (isLoading.success === undefined ? <ModalLoading show={true} /> : "") : ""}
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
                <FilterOffice 
                dentists={dentists} 
                selectOffice={selectOffice}
                setSelectOffice={setSelectOffice}
                setFilterDentists={setFilterDentists}
                isChange={isChange}
                setIsChange={setIsChange} />
            </div>

            {
                errorLoading.success === false ? (
                    filterDentits !== null ? (
                        <DentistTable
                        filterDentists={filterDentits}
                        setAlert={setAlert}
                        isChange={isChange}
                        setIsChange={setIsChange}
                        setIsLoading={setIsLoading}
                        />
                    ):(
                        <div className={`${styles.container_spinner}`}>
                            <Spinner size="lg" className={styles.spinner} animation="border" variant="info" />
                            <p className={styles.text_loading}>Cargando...</p>
                        </div>
                    )
                ):(
                    <h4 className={styles.text_error}>
                        {errorLoading.message}
                    </h4>
                )
            }
        </>
    );
}

export default MedicalDirectoryPage;
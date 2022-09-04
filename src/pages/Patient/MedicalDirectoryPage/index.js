import { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { DentistTable, FilterOffice } from './components';
import { AlertMessage, ModalLoading } from 'components';
import { getAllDentist } from 'services/FavoriteDentistService';
import { handleErrorLoading } from 'utils/handleErrors';
import styles from './MedicalDirectoryPage.module.css';

const MedicalDirectoryPage = () => {

    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});
    const [selectOffice, setSelectOffice] = useState("0");
    const [dentists, setDentists] = useState(null);
    const [filterDentits, setFilterDentists] = useState(null);

    // Estado para el mensaje de alerta
    const [alert, setAlert] = useState(null);

    // Estado para el modal de carga 
    const [isLoading, setIsLoading] = useState(null);

    useEffect(() => {
        getAllDentist().then(res => {
            setDentists(res.data);
            setFilterDentists(res.data);
        })
        .catch(err => handleErrorLoading(err, setErrorLoading));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            { isLoading ? (isLoading.success === undefined ? <ModalLoading show={true} /> : "") : ""}
            <h1 className={'page_title'}>Directorio de Odontólogos</h1>
            <div className="underline mx-auto"></div>
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
                setFilterDentists={setFilterDentists} />
            </div>

            {
                errorLoading.success === false ? (
                    filterDentits !== null ? (
                        <DentistTable
                        filterDentists={filterDentits}
                        setAlert={setAlert}
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
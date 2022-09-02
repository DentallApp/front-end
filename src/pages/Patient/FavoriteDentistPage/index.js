import { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { AlertMessage, ModalLoading } from '../../../components';
import { FavoriteDentistTable, EliminationModal } from './components';
import { getFavoriteDentist, removeFavoriteByFavoriteId } from '../../../services/FavoriteDentistService';
import { REMOVE_FAVORITE, UNEXPECTED_ERROR } from '../../../constants/InformationMessage';
import styles from './FavoriteDentistPage.module.css';

const FavoriteDentistPage = () => {

    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});
    const [dentists, setDentists] = useState(null);

    // Estado para el mensaje de alerta
    const [alert, setAlert] = useState(null);

    // Estado para el modal de creación y actualización de información de dependientes
    const [show, setShow] = useState(false);
    const [dentistSelect, setDentistSelect] = useState(null);

    // Estado para el modal de carga 
    const [isLoading, setIsLoading] = useState(null);

    useEffect(() => {
        getFavoriteDentist()
            .then(res => setDentists(res.data))
            .catch(err => handleErrorLoading(err));
    }, []);

    const handleErrorLoading = (err) => {
        if((err.response.status === 0 && err.response.data === undefined) || 
                (err.response.data.success === undefined && (err.response.status === 400 
                || err.response.status === 405 ||
                err.status === 500))) {
                setErrorLoading({success: true, message: UNEXPECTED_ERROR});
                return;
        }  
        setErrorLoading({success: true, message: err.response.data.message});
    }

    const handleErrors = (result) => {
        if(result.success === undefined && (result.status === 0 || result.status === 400 || 
            result.status === 404 || result.status === 405 ||
            result.status === 500)) {
            setAlert({success: false, message: UNEXPECTED_ERROR});
            setIsLoading({success: false});
        }
    }

    // Funciones para cerrar y mostrar el modal
    const handleClose = () => { 
        setShow(false);
        setDentistSelect(null);
    }
    const handleShow = () => setShow(true);

    const eliminateFavoriteDentist = async(dentistSelect) => {
        
        setIsLoading({success: undefined});
        const result = await removeFavoriteByFavoriteId(dentistSelect.favoriteDentistId);
        
        if(result.success && result.success === true) {
            const newList = dentists.filter(dentist => 
                dentist.favoriteDentistId !== dentistSelect.favoriteDentistId);
            
            setDentists(newList);
            setAlert({succes: true, message: REMOVE_FAVORITE});
        }
        else {
            setAlert(result);
        }  
        
        setIsLoading({success: result.success});
        
        handleErrors(result);
        handleClose();
        setDentistSelect(null);
    }


    return (
        <>
            { isLoading ? (isLoading.success === undefined ? <ModalLoading show={true} /> : "") : ""}
            { /* Ventana modal para el registro, actualización y eliminación de dependiente  */
                show === true && (
                    <EliminationModal 
                    handleClose={handleClose} 
                    show={show}
                    eliminateFavoriteDentist={eliminateFavoriteDentist}
                    dentistSelect={dentistSelect} />         
                )
            }

            <h1 className={styles.page_title}>Odontólogos Favoritos</h1>
            { /* Mensaje de alerta para mostrar información al usuario */
                alert && 
                <div className={styles.container_alert}>
                    <AlertMessage 
                    type={ alert.success === false ? 'danger' : 'success' }
                    message={ alert.message }
                    setError= { setAlert }  /> 
                </div>
            }

            {
                errorLoading.success === false ? (
                    dentists ? (
                        <FavoriteDentistTable 
                        dentists={dentists}
                        setDentistSelect={setDentistSelect}
                        handleShow={handleShow}
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

export default FavoriteDentistPage;
import { useState, useEffect } from 'react';
import { AlertMessage, ModalLoading } from '../../../components';
import { FavoriteDentistTable, EliminationModal } from './components';
import data from './data';
import styles from './FavoriteDentistPage.module.css';

const FavoriteDentistPage = () => {
    const [dentists, setDentists] = useState(null);

    // Estado para el mensaje de alerta
    const [alert, setAlert] = useState(null);

    // Estado para el modal de creación y actualización de información de dependientes
    const [show, setShow] = useState(false);
    const [dentistSelect, setDentistSelect] = useState(null);

    useEffect(() => {
        setDentists(data);
    }, []);

    // Funciones para cerrar y mostrar el modal
    const handleClose = () => { 
        setShow(false);
        setDentistSelect(null);
    }
    const handleShow = () => setShow(true);

    const eliminateFavoriteDentist = (id) => {
        setAlert({success: true, message: 'Se ha quitado de favoritos'});
        
        handleClose();
        setDentistSelect(null);
    }


    return (
        <>
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

            <FavoriteDentistTable 
            dentists={data}
            setDentistSelect={setDentistSelect}
            handleShow={handleShow}
            />

        </>
    );
}

export default FavoriteDentistPage;
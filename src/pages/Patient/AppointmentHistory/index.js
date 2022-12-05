import { useState, useEffect } from 'react';
import { AlertMessage, ModalLoading } from 'components';
import { AppointmentsTable, AppointmentModal, FilterAppointmentStatus } from './components';
import { Spinner } from 'react-bootstrap';
import { getAppointments } from 'services/AppointmentBasicUserService';
import { getAppointmentStatus } from 'services/AppointmentStatusService';
import { handleErrorLoading } from 'utils/handleErrors';
import styles from './AppointmentHistory.module.css';

const AppointmentHistory = () => {

    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});
    
    const [listStatus, setListStatus ] = useState(null);
    const [statusSelected, setStatusSelected] = useState('');
    const [appointments, setAppointments] = useState(null);
    const [filterAppointments, setFilterAppointments] = useState(null);

    const [show, setShow] = useState(false);
    const [appointmentSelect, setAppointmentSelect] = useState(null);
    const [isChange, setIsChange] = useState(false);

    // Estado para el mensaje de alerta
    const [alert, setAlert] = useState(null);

    // Estado para el modal de carga 
    const [isLoading, setIsLoading] = useState(null);

    useEffect(() => {
        getAppointmentStatus()
        .then(res => {
            setListStatus(res.data);
            setStatusSelected(res.data[0].id.toString());
        })
        .catch(err => err);

        getAppointments()
        .then(res => setAppointments(res.data))
        .catch(err => handleErrorLoading(err, setErrorLoading));
    }, [isChange]);

    useEffect(() => {
        if(parseInt(statusSelected) === 0) {
            setFilterAppointments(appointments);
            return;
        }    

        const data = appointments?.filter(appointment => 
            listStatus?.some(status => 
                status.id === parseInt(statusSelected) && status.name === appointment.status));
        
        setFilterAppointments(data);        
    }, [appointmentSelect, statusSelected, appointments, listStatus]);

    // Funciones para cerrar y mostrar el modal
    const handleClose = () => { 
        setShow(false);
        setAppointmentSelect(null);
    }
    const handleShow = () => setShow(true);
    
    return (
        <>
            { isLoading ? (isLoading.success === undefined ? <ModalLoading show={true} /> : "") : ""}
            { /* Ventana modal para el registro, actualización y eliminación de dependiente  */
                show === true && (
                    <AppointmentModal 
                    handleClose={handleClose} 
                    show={show}
                    setAppointmentSelect={setAppointmentSelect}
                    appointmentSelect={appointmentSelect}
                    setAlert={setAlert}
                    setIsLoading={setIsLoading}
                    setIsChange={setIsChange}
                    isChange={isChange} />
                )
                        
            }             
            <h1 className={'page_title'}>Historial de Citas</h1>
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
            
            {
                listStatus && (
                    <FilterAppointmentStatus 
                    listStatus={listStatus} 
                    statusSelected={statusSelected}
                    setStatusSelected={setStatusSelected}/>
                )
            }

            {
                errorLoading.success === false ? (
                    filterAppointments ? (
                        <AppointmentsTable 
                        appointments={filterAppointments}
                        handleShow={handleShow} 
                        setAppointmentSelect={setAppointmentSelect} />
                    ): 
                    (
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

export default AppointmentHistory;
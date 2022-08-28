import { useState, useEffect } from 'react';
import APPOINTMENT_STATUS from '../../../constants/AppointmentStatus';
import { AlertMessage, ModalLoading } from '../../../components';
import { AppointmentsTable, AppointmentModal, FilterAppointmentStatus } from './components';
import { Spinner } from 'react-bootstrap';
import { getAppointments } from '../../../services/AppointmentBasicUserService';
import styles from './AppointmentHistory.module.css';

const AppointmentHistory = () => {

    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});
    
    const [listStatus ] = useState(APPOINTMENT_STATUS);
    const [statusSelected, setStatusSelected] = useState('');
    const [appointments, setAppointments] = useState(null);
    const [filterAppointments, setFilterAppointments] = useState(null);

    const [show, setShow] = useState(false);
    const [appointmentSelect, setAppointmentSelect] = useState(null);
    const [isChange, setIsChange] = useState(false);

    useEffect(() => {
        getAppointments()
        .then(res => {
            setAppointments(res.data);
        })
        .catch(err => {
            handleErrorLoading(err);
        });

        setStatusSelected(APPOINTMENT_STATUS[0].id.toString());
    }, [isChange]);

    useEffect(() => {
        if(parseInt(statusSelected) === 0) {
            setFilterAppointments(appointments);
            return;
        }    

        const data = appointments?.filter(appoinment => 
            APPOINTMENT_STATUS.some(status => 
                status.id === parseInt(statusSelected) && status.name === appoinment.status));
        
        setFilterAppointments(data);        
    }, [appointmentSelect, statusSelected, appointments]);

    // Funciones para cerrar y mostrar el modal
    const handleClose = () => { 
        setShow(false);
        setAppointmentSelect(null);
    }
    const handleShow = () => setShow(true);

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

    const cancelAppointment = () => {
        console.log('hola');
        setStatusSelected(APPOINTMENT_STATUS[0].id.toString());
    }

    return (
        <>
            { /* Ventana modal para el registro, actualización y eliminación de dependiente  */
                show === true && (
                    <AppointmentModal 
                    handleClose={handleClose} 
                    show={show}
                    setAppointmentSelect={setAppointmentSelect}
                    appointmentSelect={appointmentSelect} />
                )
                        
            }             
            <h1 className={styles.page_title}>Historial de Citas</h1>
            <FilterAppointmentStatus 
            listStatus={listStatus} 
            statusSelected={statusSelected}
            setIsChange={setIsChange} 
            setStatusSelected={setStatusSelected}/>

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
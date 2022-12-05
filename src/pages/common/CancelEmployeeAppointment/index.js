import { useState, useEffect } from 'react';
import { Spinner, Button  } from 'react-bootstrap';
import moment from 'moment';
import { FilterComponent, ModalLoading, AlertMessage } from 'components';
import { AppointmentTable, AppointmentModal, CancelModal, Filters } from './components';
import { getLocalUser } from 'services/UserService';
import { 
    getAppointmentDentist, 
    cancelAppointments 
} from 'services/AppointmentEmployeeService';
import ROLES from 'constants/Roles';
import { handleErrors, handleErrorLoading } from 'utils/handleErrors';
import { formatURL } from 'utils/formatUtils';
import APPOINTMENT_STATUS from 'constants/AppointmentStatus';
import styles from './CancelEmployeeAppointment.module.css'

const CancelEmployeeAppointment = () => {
    const [show, setShow] = useState(false);
    const [appointmentsForCancel, setAppointmentsForCancel] = useState(null);
    const [appointmentSelect, setAppointmentSelect] = useState(null);
    const [appointments, setAppointments] = useState(null);
    const [selectDentist, setSelectDentist] = useState(
        (!getLocalUser().roles.includes(ROLES.SUPERADMIN) && 
        !getLocalUser().roles.includes(ROLES.ADMIN) && 
        !getLocalUser().roles.includes(ROLES.SECRETARY)) ? getLocalUser().employeeId : 0);
    const [selectOffice, setSelectOffice] = useState(getLocalUser().roles.includes(ROLES.SUPERADMIN) ? 0 : getLocalUser().officeId);

    // Estado para el modal de cancelación de citas 
    const [typeModal, setTypeModal] = useState('form');

    // Estados para el filtro
    const [filterText, setFilterText] = useState('');
    const [filterAppointments, setFilterAppointments] = useState(null);

    // Estado para el mensaje de alerta
    const [alert, setAlert] = useState(null);

    // Estado para el modal de carga 
    const [isLoading, setIsLoading] = useState(null);

    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});

    useEffect(() => {
        getAppointments(moment().format('yyyy-MM-DD'), moment().format('yyyy-MM-DD'), selectOffice, selectDentist);
        
        setAppointmentsForCancel(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, []);

    useEffect(() => {
        if(filterAppointments?.length > 0 && filterText !== '') filterData();
        
        if(filterAppointments?.length <= 0 || filterText === '') setFilterAppointments(appointments);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText]);

    const filterData = () => {
        const data = appointments.filter(appointment => 
            appointment.document.toString().includes(filterText.toLocaleLowerCase()) === true || 
                appointment.patientName.toString().toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) === true 
        );
        setFilterAppointments(data);
    }

    // Trae las citas de todos los odontologos dentro de un rango de fecha definido
    const getAppointments = (startDate, endDate, selectOffice, selectDentist) => {
        setFilterAppointments(null);

        getAppointmentDentist(
            moment(startDate).format('yyyy-MM-DD'), 
            moment(endDate).format('yyyy-MM-DD'),
            selectOffice, selectDentist, APPOINTMENT_STATUS[0].id)
                .then(res => {
                    setAppointments(res.data.data);
                    setFilterAppointments(res.data.data);
                    setAppointmentsForCancel(null);
                })
                .catch(err => handleErrorLoading(err, setErrorLoading));  
    }


    // Función que capta los datos que se ingresa en el input y realiza el filtro de la tabla 
    const handleChange = (e) => {
        setFilterText(e.target.value.toString());
        if(filterText === '' || filterAppointments.length <= 0) {
            setFilterAppointments(appointments);
        }
    }

    // Función que limpia los campos del input y resetea la tabla
    const handleClear = () => {
        setFilterAppointments(appointments);
        setFilterText('');
    };

    // Funciones para cerrar y mostrar el modal
    const handleClose = () => { 
        setShow(false);
        setAppointmentSelect(null);
    }
    const handleShow = () => setShow(true);

    const searchAppointments = (data, setError) => {
        
        if(data.from > data.to) {
            setError('from', {
                type: 'custom',
                message: 'La fecha inicial no puede ser mayor a la final'
            });
            return;
        }

        if(data.from > data.to) {
            setError('to', {
                type: 'custom',
                message: 'La fecha final no puede ser menor a la inicial'
            });
            return;
        }
        
        getAppointments(data.from, data.to, data.officeId, data.dentistId);
    }

    const updateLocalAppointments = (appointmentsCancelled, appointmentsNotCancelled = null) => {

        if(appointmentsNotCancelled !== null) {

            setAppointments(
                appointments.filter(appointment => 
                    !appointmentsCancelled.appointments.some(cancel => 
                        cancel.appointmentId === appointment.appointmentId && appointmentsNotCancelled.includes(cancel.appointmentId) === false)    
            
            ));

            setFilterAppointments(
                filterAppointments.filter(appointment => 
                    !appointmentsCancelled.appointments.some(cancel => 
                        cancel.appointmentId === appointment.appointmentId && appointmentsNotCancelled.includes(cancel.appointmentId) === false)    
            ));
        }
        else {
            setAppointments(
                appointments.filter(appointment => 
                    !appointmentsCancelled.appointments.some(cancel => 
                        cancel.appointmentId === appointment.appointmentId)    
            
            ));

            setFilterAppointments(
                filterAppointments.filter(appointment => 
                    !appointmentsCancelled.appointments.some(cancel => 
                        cancel.appointmentId === appointment.appointmentId)    
            ));
        }
    }

    // Cancela citas
    const cancel = async(data, setError) => {

        const validateReason = formatURL.test(data.reason);
        
        if(validateReason === true) {
            setError('reason', {
                type: 'custom',
                message: 'El mensaje no puede contener una URL'
            });
            return;
        }
        
        setIsLoading({success: undefined});

        const newData = {
            reason: data.reason,
            appointments: appointmentsForCancel
        }

        const result = await cancelAppointments(newData);
        
        if(result.success && result.success === true) {
            result.message = newData.appointments.length > 1 ? 'Citas canceladas con éxito' : 'Cita cancelada con éxito';
            updateLocalAppointments(newData);
        }
        
        setIsLoading({success: result.success});

        setAlert(result);

        handleErrors(result, setAlert, setIsLoading);
        handleClose();
        

        if(result.status === 400 && (result.data !== null &&  result.data !== undefined)) {
            updateLocalAppointments(newData, result.data.appointmentsId);
            setAppointmentsForCancel(appointmentsForCancel.filter(
                appointment => result.data.appointmentsId.some(id => id === appointment.appointmentId))); 
            return;      
        }

        setAppointmentsForCancel(null);
    }

    return (
        <>
            { isLoading ? (isLoading.success === undefined ? <ModalLoading show={true} /> : "") : ""}
            { /* Ventana modal para el registro, actualización y eliminación de dependiente  */
                show === true ? (
                    typeModal === 'form' ? (
                        <AppointmentModal 
                        handleClose={handleClose} 
                        show={show}
                        appointmentSelect={appointmentSelect} /> 
                    ):(
                        <CancelModal 
                        handleClose={handleClose} 
                        show={show}
                        appointmentsForCancel={appointmentsForCancel}
                        cancel={cancel}
                        />
                    )
                ):<></>
            }
            <h1 className={'page_title'}>Cancelar citas</h1>
            <div className="underline mx-auto"></div>
            {/* Mensaje de alerta para mostrar información al usuario */
                alert && 
                <div className={styles.container_alert}>
                    <AlertMessage 
                    type={ alert.success === false ? 'danger' : 'success' }
                    message={ alert.message }
                    setError= { setAlert }  /> 
                </div>
            } 
            <div className={styles.container_header}>
                <Filters
                searchAppointments={searchAppointments}
                setSelectOffice={setSelectOffice}
                setSelectDentist={setSelectDentist}
                />
            </div>
            <div className={styles.filter_text}>
                <FilterComponent 
                inputText='Digite nombre o cedula a buscar'
                onFilter={handleChange} 
                onClear={handleClear} 
                filterText={filterText}
                setFilterText={setFilterText}
                />
            </div>
            
            <hr style={{"marginTop": "30px"}}/>
            <div>
                <Button
                className={styles.btn_cancel}
                disabled={appointmentsForCancel ? (appointmentsForCancel.length > 0 ? false : true ) : true}
                onClick={() => {
                    setTypeModal('cancel');
                    handleShow();
                }}
                >
                    Cancelar citas
                </Button>
            </div>
            
            {
                errorLoading.success === false ? (
                    filterAppointments ? (
                        <AppointmentTable
                        data={filterAppointments}
                        setAppointmentsForCancel={setAppointmentsForCancel}
                        setAppointmentSelect={setAppointmentSelect}
                        handleShow={handleShow}
                        setTypeModal={setTypeModal}
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

export default CancelEmployeeAppointment;
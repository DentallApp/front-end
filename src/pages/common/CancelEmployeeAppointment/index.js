import { useState, useEffect } from 'react';
import {  Col, Spinner, Button  } from 'react-bootstrap';
import moment from 'moment';
import { Filters, FilterComponent, FilterDentist, ModalLoading, AlertMessage  } from 'components';
import { AppointmentTable, AppointmentModal, CancelModal } from './components';
import { getDentists } from 'services/DentistScheduleService';
import { getLocalUser } from 'services/UserService';
import { 
    getScheduledAppointmentByOffice, 
    getScheduledAppointmentByDentist, 
    cancelAppointments 
} from 'services/AppointmentEmployeeService';
import ROLES from 'constants/Roles';
import { filterAppointmentByDentist } from './utils';
import { handleErrors, handleErrorLoading } from 'utils/handleErrors';
import { formatURL } from 'utils/formatUtils';
import styles from './CancelEmployeeAppointment.module.css'

const CancelEmployeeAppointment = () => {
    const [show, setShow] = useState(false);
    const [appointmentsForCancel, setAppointmentsForCancel] = useState(null);
    const [appointmentSelect, setAppointmentSelect] = useState(null);
    const [storeAppointments, setStoreAppointments] = useState(null);
    const [appointments, setAppointments] = useState(null);
    const [dentists, setDentists] = useState(null);
    const [selectDentist, setSelectDentist] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

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
        if(getLocalUser().roles.includes(ROLES.SECRETARY) || getLocalUser().roles.includes(ROLES.ADMIN))
            getDentists().then(res => setDentists(res.data))
                .catch(err => err)
        
        getAppointments(startDate, endDate);
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, []);

    useEffect(() => {
        if(filterAppointments?.length > 0 && filterText !== '') filterData();
       
        if((filterAppointments?.length <= 0 || filterText === '') && selectDentist === 0 ) setFilterAppointments(storeAppointments);
        
        if((filterAppointments?.length <= 0 || filterText === '') && selectDentist !== 0 ) setFilterAppointments(appointments);
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
    const getAppointments = (startDate, endDate) => {

        if(getLocalUser().roles.includes(ROLES.SECRETARY) || getLocalUser().roles.includes(ROLES.ADMIN)) {
            getScheduledAppointmentByOffice(moment(startDate).format('yyyy-MM-DD'), moment(endDate).format('yyyy-MM-DD'))
                .then(res => {
                    setStoreAppointments(res.data);
                    setAppointments(res.data);
                    setFilterAppointments(res.data);
                })
                .catch(err => handleErrorLoading(err, setErrorLoading)); 
        }
        else {
            getScheduledAppointmentByDentist(moment(startDate).format('yyyy-MM-DD'), moment(endDate).format('yyyy-MM-DD'))
                .then(res => {
                    setStoreAppointments(res.data);
                    setAppointments(res.data);
                    setFilterAppointments(res.data);
                })
                .catch(err => handleErrorLoading(err, setErrorLoading)); 
        }   
    }


    // Función que capta los datos que se ingresa en el input y realiza el filtro de la tabla 
    const handleChange = (e) => {
        setFilterText(e.target.value.toString());
        if((filterText === '' || filterAppointments.length <= 0) && selectDentist === 0) 
            setFilterAppointments(storeAppointments);
        
        if((filterText === '' || filterAppointments.length <= 0) && selectDentist !== 0)
            setFilterAppointments(appointments)
    }

    // Función que limpia los campos del input y resetea la tabla
    const handleClear = () => {
        if(selectDentist !== 0) setFilterAppointments(appointments);
        
        if(selectDentist === 0) setFilterAppointments(storeAppointments);
        setFilterText('');
    };

    const handleSelectDentist = (e) => {
        setSelectDentist(parseInt(e.value));
        
        if(parseInt(e.value) !== 0) {
            const result = filterAppointmentByDentist(parseInt(e.value), storeAppointments);
            console.log()
            setAppointments(result);
            setFilterAppointments(result);
        }
        else {
            setAppointments(storeAppointments);
            setFilterAppointments(storeAppointments);
        }
    }

    // Funciones para cerrar y mostrar el modal
    const handleClose = () => { 
        setShow(false);
        setAppointmentSelect(null);
    }
    const handleShow = () => setShow(true);

    const searchAppointments = (data, setError) => {
        
        if(data.startDate > data.endDate) {
            setError('startDate', {
                type: 'custom',
                message: 'La fecha inicial no puede ser mayor a la final'
            });
            return;
        }

        if(data.startDate > data.endDate) {
            setError('endDate', {
                type: 'custom',
                message: 'La fecha final no puede ser menor a la inicial'
            });
            return;
        }

        setStartDate(data.startDate);
        setEndDate(data.endDate);
        getAppointments(data.startDate, data.endDate);
    }

    const updateLocalAppointments = (appointmentsCancelled) => {
        
        setStoreAppointments(
            storeAppointments.filter(appointment => 
                !appointmentsCancelled.appoinments.some(cancel => 
                    cancel.appoinmentId === appointment.appoinmentId)    
        ));
        
        setAppointments(
            appointments.filter(appointment => 
                !appointmentsCancelled.appoinments.some(cancel => 
                    cancel.appoinmentId === appointment.appoinmentId)    
        ));

        setFilterAppointments(
            filterAppointments.filter(appointment => 
                !appointmentsCancelled.appoinments.some(cancel => 
                    cancel.appoinmentId === appointment.appoinmentId)    
        ));
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
            appoinments: appointmentsForCancel
        }

        const result = await cancelAppointments(newData);
        if(result.success && result.success === true) {
            result.message = newData.appoinments.length > 1 ? 'Citas canceladas con éxito' : 'Cita cancelada con éxito';
            updateLocalAppointments(newData);
        }
        
        setIsLoading({success: result.success});
        setAlert(result);

        handleErrors(result, setAlert, setIsLoading);
        handleClose();
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
            <h1 className={styles.page_title}>Cancelar citas</h1>
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
               startDate={moment(startDate).format('yyyy-MM-DD')}
               endDate={moment(endDate).format('yyyy-MM-DD')} 
               dentists={dentists}
               handleSelectDentist={handleSelectDentist}
               searchAppointments={searchAppointments}
               />
            </div>
            <div className={styles.container_filters}>
                {
                    getLocalUser().roles.includes(ROLES.SECRETARY) ||
                        getLocalUser().roles.includes(ROLES.ADMIN)  ? (
                            <Col sm={12} lg={6} md>
                                <FilterDentist
                                dentists={dentists}
                                handleSelectDentist={handleSelectDentist}
                                /> 
                            </Col>
                        ):(
                            <></>
                        )
                }
                
                <FilterComponent 
                inputText='Escriba el nombre o cedula del paciente'
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
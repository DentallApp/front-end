import { useState, useEffect, useContext } from 'react';
import {  Col, Spinner  } from 'react-bootstrap';
import moment from 'moment';
import { Filters, ModalLoading, AlertMessage } from 'components';
import { AppointmentModal, DescriptionStatus, MobileCalendar, WebCalendar } from './components';
import SideBarContext from 'context/SideBarContext';
import { setEventClassNames } from './utils';
import APPOINTMENT_STATUS from 'constants/AppointmentStatus';
import { getAppointmentStatus } from 'services/AppointmentStatusService';
import { getDentists } from 'services/DentistScheduleService';
import { getLocalUser } from 'services/UserService';
import { getAppointmentByOffice, updateStatusAppointment, getAllAppointmentByDentist } from 'services/AppointmentEmployeeService';
import { FilterDentist, FilterComponent } from 'components';
import ROLES from 'constants/Roles';
import { mappingAppointments, filterAppointmentByDentist } from './AppointmentUtils';
import { handleErrors, handleErrorLoading } from 'utils/handleErrors';
import styles from './EmployeeAppointmentView.module.css';

const EmployeeAppointmentView = () => {
    const [show, setShow] = useState(false);
    const [appointmentSelect, setAppointmentSelect] = useState(null);
    const [storeAppointments, setStoreAppointments] = useState(null);
    const [appointments, setAppointments] = useState(null);
    const [dentists, setDentists] = useState(null);
    const [selectDentist, setSelectDentist] = useState(0);
    const [listStatus, setListStatus] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const { onlyWidth } = useContext(SideBarContext);

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

        getAppointmentStatus().then(res => setListStatus(res.data))
            .catch(err => err);
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
            getAppointmentByOffice(moment(startDate).format('yyyy-MM-DD'), moment(endDate).format('yyyy-MM-DD'))
                .then(res => {
                    setStoreAppointments(mappingAppointments(res.data));
                    setAppointments(mappingAppointments(res.data));
                    setFilterAppointments(mappingAppointments(res.data));
                })
                .catch(err => handleErrorLoading(err, setErrorLoading)); 
        }
        else {
            getAllAppointmentByDentist(moment(startDate).format('yyyy-MM-DD'), moment(endDate).format('yyyy-MM-DD'))
                .then(res => {
                    setStoreAppointments(mappingAppointments(res.data));
                    setAppointments(mappingAppointments(res.data));
                    setFilterAppointments(mappingAppointments(res.data));
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

    // Se encarga de manejar el estado del Select de los odontologos
    const handleSelectDentist = (e) => {
        setSelectDentist(parseInt(e.value));
        
        if(parseInt(e.value) !== 0) {
            const result = filterAppointmentByDentist(parseInt(e.value), storeAppointments);
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

    // Función que se llama al dar clic en el boton consultar
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

    const updateStatus = async(statusId) => {
        const id = appointmentSelect.event.extendedProps.appoinmentId;
        const result = await updateStatusAppointment(statusId, id);
        if(result.success && result.success === true) {
            updateLocalDataAppointment(statusId, parseInt(appointmentSelect.event.extendedProps.appoinmentId));
            result.message = 'Estado de la cita actualizado con éxito';
        }
            
        setIsLoading({success: result.success});
        setAlert(result);
        return result;
    }

    const updateLocalDataAppointment = (id) => {
        const status = APPOINTMENT_STATUS.filter(status => status.id === id)[0];

        setStoreAppointments(storeAppointments.map(appointment => 
            appointment.appoinmentId === parseInt(appointmentSelect.event.extendedProps.appoinmentId)   ? { 
                ...appointment, 
                statusId: status.id, 
                status: status.name,
                color: status.colorHex
            } : appointment 
        ));

        setAppointments(storeAppointments.map(appointment => 
            appointment.appoinmentId === parseInt(appointmentSelect.event.extendedProps.appoinmentId)   ? { 
                ...appointment, 
                statusId: status.id, 
                status: status.name,
                color: status.colorHex
            } : appointment 
        ));

        setFilterAppointments(storeAppointments.map(appointment => 
            appointment.appoinmentId === parseInt(appointmentSelect.event.extendedProps.appoinmentId)   ? { 
                ...appointment, 
                statusId: status.id, 
                status: status.name,
                color: status.colorHex
            } : appointment 
        ));
    }

    // Guarda el cambio de estado de una cita
    const saveChanges = async(statusId) => {
        setIsLoading({success: undefined});
        statusId.statusId = parseInt(statusId.statusId);
        
        const result = await updateStatus(statusId.statusId);

        handleErrors(result, setAlert, setIsLoading);
        handleClose();
        setAppointmentSelect(null);
    }

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
                    saveChanges ={saveChanges}
                    listStatus={listStatus}
                    />
                )
                        
            }  
            <h1 className={styles.page_title}>Citas programadas</h1>
            <div className="underline mx-auto"></div>
            <div className={styles.container_header}>
              <Filters
               startDate={moment(startDate).format('yyyy-MM-DD')}
               endDate={moment(endDate).format('yyyy-MM-DD')} 
               dentists={dentists}
               handleSelectDentist={handleSelectDentist}
               searchAppointments={searchAppointments}
               />
            </div>
            
            <div className={styles.container_filters} >
  
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
            
            {listStatus && <><DescriptionStatus listStatus={listStatus}/><br/></> }
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
                    filterAppointments ? (
                        onlyWidth < 768 ? (
                            <MobileCalendar 
                            events={filterAppointments} 
                            setAppointmentSelect={setAppointmentSelect} 
                            handleShow={handleShow}
                            setEventClassNames={setEventClassNames}
                            startDate={startDate}
                            endDate={endDate}
                            />
                        ):(
                            <WebCalendar
                            events={filterAppointments}
                            setAppointmentSelect={setAppointmentSelect}
                            handleShow={handleShow}
                            setEventClassNames={setEventClassNames}
                            startDate={startDate}
                            endDate={endDate}
                            />
                        )
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

export default EmployeeAppointmentView;
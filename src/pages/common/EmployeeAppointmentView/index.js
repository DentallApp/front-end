import { useState, useEffect, useContext } from 'react';
import { Spinner  } from 'react-bootstrap';
import moment from 'moment';
import { ModalLoading, AlertMessage } from 'components';
import { 
    AppointmentModal, 
    DescriptionStatus, 
    MobileCalendar, 
    WebCalendar,
    Filters 
} from './components';
import SideBarContext from 'context/SideBarContext';
import { setEventClassNames } from './utils';
import APPOINTMENT_STATUS from 'constants/AppointmentStatus';
import { getAppointmentStatus } from 'services/AppointmentStatusService';
import { getLocalUser } from 'services/UserService';
import { 
    getAppointmentDentist, 
    updateStatusAppointment
} from 'services/AppointmentEmployeeService';
import { FilterComponent } from 'components';
import ROLES from 'constants/Roles';
import { mappingAppointments } from './AppointmentUtils';
import { handleErrors, handleErrorLoading } from 'utils/handleErrors';
import styles from './EmployeeAppointmentView.module.css';

const EmployeeAppointmentView = () => {
    const [show, setShow] = useState(false);
    const [appointmentSelect, setAppointmentSelect] = useState(null);
    const [appointments, setAppointments] = useState(null);
    const [listStatus, setListStatus] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectStatus, setSelectStatus] = useState(0);
    const [selectDentist, setSelectDentist] = useState(
        (!getLocalUser().roles.includes(ROLES.SUPERADMIN) && 
        !getLocalUser().roles.includes(ROLES.ADMIN) && 
        !getLocalUser().roles.includes(ROLES.SECRETARY)) ? getLocalUser().employeeId : 0);
    const [selectOffice, setSelectOffice] = useState(getLocalUser().roles.includes(ROLES.SUPERADMIN) ? 0 : getLocalUser().officeId);
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
        getAppointments(startDate, endDate, selectOffice, selectDentist, selectStatus);

        getAppointmentStatus().then(res => {
            setListStatus(res.data);
        })
        .catch(err => err);
            
        // eslint-disable-next-line react-hooks/exhaustive-deps    
    }, []);

    useEffect(() => {
        if(filterAppointments?.length > 0 && filterText !== '') filterData();
        
        if(filterAppointments?.length <= 0 || filterText === '') setFilterAppointments(appointments);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText]);

    const filterData = () => {
        const data = appointments.filter(appointment => 
            appointment.document?.toString().includes(filterText.toLocaleLowerCase()) === true || 
            appointment.patientName?.toString().toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) === true
        );
        setFilterAppointments(data);
    }

    // Trae las citas filtradas por rango de fecha, consultorio, dentista y estado de la cita
    const getAppointments = (startDate, endDate, selectOffice, selectDentist, selectStatus) => {
        getAppointmentDentist(
            moment(startDate).format('yyyy-MM-DD'), 
            moment(endDate).format('yyyy-MM-DD'),
            selectOffice, selectDentist, selectStatus)
            .then(res => {
                setAppointments(mappingAppointments(res.data.data));
                setFilterAppointments(mappingAppointments(res.data.data));
            })
            .catch(err => handleErrorLoading(err, setErrorLoading));    
    }

    // Función que capta los datos que se ingresa en el input y realiza el filtro de la tabla 
    const handleChange = (e) => {
        setFilterText(e.target.value.toString());
        if(filterText === '' || filterAppointments?.length <= 0) {
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

    // Función que se llama al dar clic en el boton consultar
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
        setStartDate(data.from);
        setEndDate(data.to);
        getAppointments(data.from, data.to, data.officeId, data.dentistId, data.statusId);
    }

    const updateStatus = async(statusId) => {
        const id = appointmentSelect.event.extendedProps.appointmentId;
        const result = await updateStatusAppointment(statusId, id);
        if(result.success && result.success === true) {
            updateLocalDataAppointment(statusId);
            result.message = 'Estado de la cita actualizado con éxito';
        }
            
        setIsLoading({success: result.success});
        setAlert(result);
        return result;
    }

    const updateLocalDataAppointment = (id) => {
        const tempStatus = listStatus.filter(status => status.id === id);
        const status = APPOINTMENT_STATUS.filter(status => status.name === tempStatus[0].name)[0];
        
        setAppointments(appointments.map(appointment => 
            appointment.appointmentId === parseInt(appointmentSelect.event.extendedProps.appointmentId)   ? { 
                ...appointment, 
                statusId: status.id, 
                status: status.name,
                color: status.colorHex
            } : appointment 
        ));

        setFilterAppointments(filterAppointments.map(appointment => 
            appointment.appointmentId === parseInt(appointmentSelect.event.extendedProps.appointmentId) ? { 
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
               setStartDate={setStartDate}
               setEndDate={setEndDate} 
               listStatus={listStatus}
               searchAppointments={searchAppointments}
               setSelectStatus={setSelectStatus}
               setSelectOffice={setSelectOffice}
               setSelectDentist={setSelectDentist}
               />
            </div>
            
            <div style={{'marginLeft': '20px'}} >
                <FilterComponent
                inputText='Digite nombre o cedula a buscar'
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
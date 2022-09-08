import { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import data from './data';
import { Filters } from 'components';
import { AppointmentModal, DescriptionStatus, MobileCalendar, WebCalendar } from './components';
import SideBarContext from 'context/SideBarContext';
import { setEventClassNames } from './utils';
import APPOINTMENT_STATUS from 'constants/AppointmentStatus';
import { getAppointmentStatus } from 'services/AppointmentStatusService';
import { getDentists } from 'services/DentistScheduleService';
import { getLocalUser } from 'services/UserService';
import ROLES from 'constants/Roles';
import styles from './EmployeeAppointmentView.module.css'
import { FilterComponent } from 'components';

const EmployeeAppointmentView = () => {
    const [show, setShow] = useState(false);
    const [appointmentSelect, setAppointmentSelect] = useState(null);
    const [appointments, setAppointments] = useState(data);
    const [dentists, setDentists] = useState(null);
    const [selectDentist, setSelectDentist] = useState(0);
    const [listStatus, setListStatus] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const { onlyWidth } = useContext(SideBarContext);

    // Estados para el filtro
    const [filterText, setFilterText] = useState('');
    const [filterAppointments, setFilterAppointments] = useState([]);

    useEffect(() => {
        (getLocalUser().roles.includes(ROLES.SECRETARY) || getLocalUser().roles.includes(ROLES.ADMIN)) && (
            getDentists().then(res => setDentists(res.data))
                .catch(err => err)
        )

        getAppointmentStatus().then(res => setListStatus(res.data))
            .catch(err => err);
    }, []);

    useEffect(() => {
        if(filterAppointments?.length > 0 && filterText !== '') filterData();
       
        if(filterAppointments?.length <= 0 || filterText === '') setFilterAppointments(appointments);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText]);

    const filterData = () => {
        const data = appointments.filter(appointment => 
            appointment.document.toString().includes(filterText.toLocaleLowerCase()) === true || 
                appointment.patient.toString().toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) === true 
        );
        setFilterAppointments(data);
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

    const handleSelectDentist = (e) => {
        setSelectDentist(parseInt(e.value));
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
    }

    // Guarda el cambio de estado de una cita
    const saveChanges = (statusId) => {
        statusId.statusId = parseInt(statusId.statusId)
        const status = APPOINTMENT_STATUS.filter(status => status.id === statusId.statusId)[0];

        const newList = appointments.map(appointment => 
            appointment.id === parseInt(appointmentSelect.event.id)   ? { ...appointment, ...statusId, status: status.name} : appointment  
        );
        
        setAppointments(newList);
        setFilterAppointments(filterAppointments.map(appointment => 
            appointment.id === parseInt(appointmentSelect.event.id)   ? { ...appointment, ...statusId, status: status.name} : appointment ))
    }

    return (
        <>
            { /* Ventana modal para el registro, actualización y eliminación de dependiente  */
                show === true && (
                    <AppointmentModal 
                    handleClose={handleClose} 
                    show={show}
                    setAppointmentSelect={setAppointmentSelect}
                    appointmentSelect={appointmentSelect}
                    saveChanges ={saveChanges}
                    listStatus={listStatus}
                    //setAlert={setAlert}
                    //setIsLoading={setIsLoading}
                    //setIsChange={setIsChange}
                    //isChange={isChange} 
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
            <div style={{'marginLeft': '20px', 'marginRight': '20px', 'display': 'flex', 'alignItems': 'center'}}>
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
            {
                filterAppointments && (
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
                )
            }
        </>
    );
}

export default EmployeeAppointmentView;
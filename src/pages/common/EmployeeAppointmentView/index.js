import { useState, useEffect, useContext } from 'react';
import data from './data';
import { AppointmentModal, DescriptionStatus, MobileCalendar, WebCalendar, Filters } from './components';
import SideBarContext from 'context/SideBarContext';
import { setEventClassNames } from './utils';
import styles from './EmployeeAppointmentView.module.css'
import APPOINTMENT_STATUS from 'constants/AppointmentStatus';

const EmployeeAppointmentView = () => {
    const [show, setShow] = useState(false);
    const [appointmentSelect, setAppointmentSelect] = useState(null);
    const [appointments, setAppointments] = useState(data);
    const { onlyWidth } = useContext(SideBarContext);

    // Funciones para cerrar y mostrar el modal
    const handleClose = () => { 
        setShow(false);
        setAppointmentSelect(null);
    }
    const handleShow = () => setShow(true);

    const saveChanges = (statusId) => {
        statusId.statusId = parseInt(statusId.statusId)
        const status = APPOINTMENT_STATUS.filter(status => status.id === statusId.statusId)[0];

        const newList = appointments.map(appointment => 
            appointment.id === parseInt(appointmentSelect.event.id)   ? { ...appointment, ...statusId, status: status.name} : appointment  
        );
        
        setAppointments(newList);
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
              <Filters />
            </div>
            <hr style={{"marginTop": "30px"}}/>
            <DescriptionStatus /><br/>  
            {
                onlyWidth < 768 ? (
                    <MobileCalendar 
                    events={appointments} 
                    setAppointmentSelect={setAppointmentSelect} 
                    handleShow={handleShow}
                    setEventClassNames={setEventClassNames}
                    />
                ):(
                    <WebCalendar
                    events={appointments}
                    setAppointmentSelect={setAppointmentSelect}
                    handleShow={handleShow}
                    setEventClassNames={setEventClassNames}
                    />
                )
            }
        </>
    );
}

export default EmployeeAppointmentView;
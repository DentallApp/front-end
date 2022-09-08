import { useState, useEffect } from 'react';
import moment from 'moment';
import data from './data';
import { Filters, FilterComponent } from 'components';
import { AppointmentTable, AppointmentModal, CancelModal } from './components';
import { getDentists } from 'services/DentistScheduleService';
import { getLocalUser } from 'services/UserService';
import ROLES from 'constants/Roles';
import styles from './CancelEmployeeAppointment.module.css'
import { Button } from 'react-bootstrap';

const CancelEmployeeAppointment = () => {
    const [show, setShow] = useState(false);
    const [appointmentSelect, setAppointmentSelect] = useState(null);
    const [appointmentsForCancel, setAppointmentsForCancel] = useState(null);
    const [appointments, setAppointments] = useState(data);
    const [dentists, setDentists] = useState(null);
    const [selectDentist, setSelectDentist] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    // Estado para el modal de cancelación de citas 
    const [typeModal, setTypeModal] = useState('form');

    // Estados para el filtro
    const [filterText, setFilterText] = useState('');
    const [filterAppointments, setFilterAppointments] = useState([]);

    useEffect(() => {
        (getLocalUser().roles.includes(ROLES.SECRETARY) || getLocalUser().roles.includes(ROLES.ADMIN)) && (
            getDentists().then(res => setDentists(res.data))
                .catch(err => err)
        )
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

    // Cancela citas
    const cancelAppointments = (data) => {
        console.log(data);
        console.log(appointmentsForCancel);
    }

    return (
        <>
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
                        cancelAppointments={cancelAppointments}
                        />
                    )
                ):<></>
            }
            <h1 className={styles.page_title}>Cancelar citas</h1>
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

            <AppointmentTable
            data={filterAppointments}
            setAppointmentsForCancel={setAppointmentsForCancel}
            setAppointmentSelect={setAppointmentSelect}
            handleShow={handleShow}
            setTypeModal={setTypeModal}
            />
        </>
    );
}

export default CancelEmployeeAppointment;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import { IoAddCircle } from "react-icons/io5";
import { AlertMessage, ModalLoading, FilterComponent } from 'components';
import { PatientTable, AppointmentModal } from './components';
import { handleErrors, handleErrorLoading } from 'utils/handleErrors';
import { searchPerson } from 'services/PersonService';
import { createAppointment } from 'services/SchedulingService';
import { getLocalUser } from 'services/UserService';
import styles from './AppointmentPage.module.css';

const AppointmentPage = () => {

    const navigate = useNavigate();
    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});

    // Estados para el filtro
    const [patients, setPatients] = useState('');

    // Estados para el filtro
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    // Estado para el modal de agendamiento de cita
    const [show, setShow] = useState(false);
    const [patientSelect, setPatientSelect] = useState(null);

    // Estado para el mensaje de alerta
    const [alert, setAlert] = useState(null);

    // Estado para el modal de carga 
    const [isLoading, setIsLoading] = useState(null);
    
    useEffect(() => {
        filterData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText]);

    const filterData = () => {
        if(filterText !== '')
            searchPerson(filterText).then(res => setPatients(res.data))
                .catch(err => handleErrorLoading(err, setErrorLoading))
    }

    // Función que capta los datos que se ingresa en el input y realiza el filtro de la tabla 
    const handleChange = (e) => {
        setFilterText(e.target.value.toString());
        if(filterText === '' || patients?.length <= 0) {
            setResetPaginationToggle(!resetPaginationToggle);
            setPatients(null);
        }
    }

    // Función que limpia los campos del input y resetea la tabla
    const handleClear = () => {
        setResetPaginationToggle(!resetPaginationToggle);
        setPatients(null);
        setFilterText('');
    };

    // Funciones para cerrar y mostrar el modal
    const handleClose = () => { 
        setShow(false);
        setPatientSelect(null);
    }
    const handleShow = () => setShow(true);

    const createNewAppointment = async(data, reset) => {
        setIsLoading({success: undefined});

        const dataAppointment = {
            userId: getLocalUser().userId,
            personId: patientSelect.personId,
            dentistId: data.dentistId,
            generalTreatmentId: data.generalTreatmentId,
            officeId: data.officeId,
            appoinmentDate: data.appointmentDate,
            startHour: data.hours.startHour,
            endHour: data.hours.endHour
        }

        const result = await createAppointment(dataAppointment);
        setAlert(result);
        setIsLoading({success: result.success});

        handleClose();
        reset();
        handleErrors(result, setAlert, setIsLoading);
    }

    return (
        <>
            { isLoading ? (isLoading.success === undefined ? <ModalLoading show={true} /> : "") : ""}
            { /* Ventana modal para el registro, actualización y eliminación de dependiente  */
                show === true && (
                    <AppointmentModal 
                    handleClose={handleClose} 
                    show={show}
                    createNewAppointment={createNewAppointment}
                    />
                )
                        
            }     
            <h1 className={`page_title`}>Agendar Cita</h1>
            <div className="underline mx-auto"></div>
            { 
                alert && 
                <AlertMessage 
                type={ alert.success === false ? 'danger' : 'success' }
                message={ alert.message }
                setError= { setAlert }  /> 
            }
            <div className={styles.container_header}>
                <Button 
                className={styles.button_add}
                onClick={() => navigate('/registrar-paciente')}> 
                    <IoAddCircle className={styles.icon} /> Nuevo paciente
                </Button>
                <FilterComponent 
                onFilter={handleChange} 
                onClear={handleClear} 
                filterText={filterText}
                setFilterText={setFilterText}
                inputText="Ingrese nombre o cedula de paciente a buscar"
                className={styles.filter} />
            </div>

            {
                errorLoading.success === false ? (
                    filterText !== '' ? (
                        patients ? (
                            <PatientTable
                            patients={patients}
                            handleShow={handleShow}
                            setPatientSelect={setPatientSelect} 
                            />
                        ):(
                            <div className={`${styles.container_spinner}`}>
                                <Spinner size="lg" className={styles.spinner} animation="border" variant="info" />
                                <p className={styles.text_loading}>Cargando...</p>
                            </div>
                        )
                    ): (
                        <h4 className={styles.text_error}>
                            No hay pacientes por mostrar
                        </h4>
                    ) 
                ): 
                (
                    <h4 className={styles.text_error}>
                        {errorLoading.message}
                    </h4>
                )
            }    
        </>
    );
}

export default AppointmentPage;
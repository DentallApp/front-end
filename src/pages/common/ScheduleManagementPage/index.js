import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { IoAddCircle } from "react-icons/io5";
import { ScheduleTable, FilterDentist, FormModal, AllScheduleTable } from './components';
import { AlertMessage, ModalLoading } from '../../../components';
import { validationScheduleMorning, validationScheduleAfternoon } from './utils';
import { 
    getDentists, 
    getSchedulesByEmployee, 
    createSchedule, 
    updateSchedule,
    getAllSchedule } from '../../../services/DentistScheduleService';
import { UNEXPECTED_ERROR } from '../../../constants/InformationMessage';
import styles from './ScheduleManagementPage.module.css';

const ScheduleManagementPage = () => {

    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});

    const [dentists, setDentists] = useState(null);
    const [selectedDentist, setSelectedDentist] = useState(0);
    const [schedules, setSchedules] = useState(null);
    const [allSchedules, setAllSchedules] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    // Estado para el modal de creación y actualización de información de usuarios
    const [show, setShow] = useState(false);
    const [rowSelect, setRowSelect] = useState(null);

    // Estado para el mensaje de alerta
    const [alert, setAlert] = useState(null);

    // Estado para el modal de carga 
    const [isLoading, setIsLoading] = useState(null);

    const [isChange, setIsChange] = useState(null)

    useEffect(() => {
        getDentists().then(res => setDentists(res.data))
            .catch(err => err);
    }, []);

    useEffect(() => {
        getAllSchedule().then(res => setAllSchedules(res.data))
            .catch(err => handleErrorLoading(err));    
    }, [isChange]);

    // Funciones para cerrar y mostrar el modal
    const handleClose = () => { 
        setShow(false);
        setRowSelect(null);
    }
    const handleShow = () => setShow(true);

    const showSchedules = (employeeId) => {
        if(parseInt(employeeId) !== 0) {
            getSchedulesByEmployee(parseInt(employeeId))
                .then(res => setSchedules(res.data))
                .catch(err => handleErrorLoading(err));
        }
        else {
            setAllSchedules(allSchedules);
        }
    }

    const handleSelectDentist = (e) => {
        setSelectedDentist(parseInt(e.value));
        showSchedules(e.value);
    }

    const handleErrors = (result) => {
        if(result.success === undefined && (result.status === 0 || result.status === 400 || 
            result.status === 404 || result.status === 405 ||
            result.status === 500)) {
            setAlert({success: false, message: UNEXPECTED_ERROR});
            setIsLoading({success: false});
        }
    }

    const handleErrorLoading = (err) => {
        if((err.response.status === 0 && err.response.data === undefined) || 
                (err.response.data.success === undefined && (err.response.status === 400 
                || err.response.status === 405 ||
                err.status === 500))) {
                setErrorLoading({success: true, message: UNEXPECTED_ERROR});
                return;
        }  
        setErrorLoading({success: true, message: err.response.data.message});
    }

    const create = async (data) => {
        data.employeeId = parseInt(selectedDentist);

        const result = await createSchedule(data);
        if(result.success && result.success === true) {
            showSchedules(data.employeeId);
            setIsChange(!isChange);
        }    

        setIsLoading({success: result.success});
        setAlert(result);

        return result;
    }

    const update = async (data) => {
        data.scheduleId = parseInt(data.scheduleId);
        data.employeeId = parseInt(selectedDentist);
        data.morningStartHour = data.morningStartHour === 'null' ? null : data.morningStartHour;
        data.morningEndHour = data.morningEndHour === 'null' ? null : data.morningEndHour;
        data.afternoonStartHour = data.afternoonStartHour === 'null' ? null : data.afternoonStartHour;
        data.afternoonEndHour = data.afternoonEndHour === 'null' ? null : data.afternoonEndHour;
        data.isDeleted = parseInt(data.statusId) === 1 ? false : true;
        
        const result = await updateSchedule(data);
        if(result.success && result.success === true) {
            showSchedules(data.employeeId);
            setIsChange(!isChange);
        }    

        setIsLoading({success: result.success});
        setAlert(result);

        return result;
    }

    const saveSchedule = async(data, reset, type, setError) => {
        
        if(parseInt(data.weekDayId) === 0) {
            setError("weekDayId", {
                type: 'custom5',
                message: 'Seleccione un día'
            });
            return;
        }

        const validationMorning = validationScheduleMorning(data, setError);
        const validationAfternoon = validationScheduleAfternoon(data, setError);

        if(validationMorning === false) return;
        if(validationAfternoon === false) return;
        
        let result = null;

        if(type === 'create') result = await create(data);
        else result = await update(data);
        
        handleErrors(result);
        handleClose();
        reset();
        setSelectedSchedule(null);
    }

    return (
        <>
            { isLoading ? (isLoading.success === undefined ? <ModalLoading show={true} /> : "") : ""}
            { /* Ventana modal para el registro, actualización y eliminación de dependiente  */
                show === true && (
                    <FormModal
                    handleClose={handleClose} 
                    show={show}
                    specificTreatmentSelect={rowSelect}
                    schedules={schedules}
                    scheduleSelect={selectedSchedule}
                    saveSchedule={saveSchedule} />         
                )
            }    
            <h1 className={styles.page_title}>Gestión de Horarios</h1>
            { /* Mensaje de alerta para mostrar información al usuario */
                alert && 
                <div className={styles.container_alert}>
                    <AlertMessage 
                    type={ alert.success === false ? 'danger' : 'success' }
                    message={ alert.message }
                    setError= { setAlert }  /> 
                </div>
            }

            <div className={styles.container_header}>
                {
                    dentists && (
                        <FilterDentist 
                        dentists={dentists}
                        selectedDentist={selectedDentist}
                        handleSelectDentist={handleSelectDentist}
                        className={styles.select_dentist}
                        />
                    )
                }
                
                { 
                    (selectedDentist !== 0 && selectedDentist !== null) ? (
                        <Button 
                        className={styles.button_add} 
                        onClick={() => {
                            handleShow();
                        }}>
                            <IoAddCircle className={styles.icon} /> Agregar horario
                        </Button> 
                    ):<></>
                }    
            </div>

            {
                errorLoading.success === false ? (
                    selectedDentist === 0 ? (
                        allSchedules ? (
                            <AllScheduleTable
                            allSchedules={allSchedules}
                            />
                        ):(
                            <div className={`${styles.container_spinner}`}>
                                <Spinner size="lg" className={styles.spinner} animation="border" variant="info" />
                                <p className={styles.text_loading}>Cargando...</p>
                            </div>
                        )
                    ):(
                        schedules ? (
                            <ScheduleTable 
                            schedules={schedules}
                            setSelectedSchedule={setSelectedSchedule}
                            handleShow={handleShow}
                            />
                        ):(
                            <div className={`${styles.container_spinner}`}>
                                <Spinner size="lg" className={styles.spinner} animation="border" variant="info" />
                                <p className={styles.text_loading}>Cargando...</p>
                            </div>
                        )
                    )
                )
                :(
                    <h4 className={styles.text_error}>
                        {errorLoading.message}
                    </h4>
                )
            }    
            
        </>
    );
}

export default ScheduleManagementPage;
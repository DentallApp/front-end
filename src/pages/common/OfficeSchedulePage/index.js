import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { IoAddCircle } from "react-icons/io5";
import { ScheduleTable, FilterOffice, FormModal, AllScheduleTable } from './components';
import { validationSchedule } from './utils';
import { getLocalUser } from 'services/UserService';
import { getOfficesActiveAndInactive} from 'services/OfficeService';
import { getAllSchedules, getScheduleByOfficeId, createSchedule, updateSchedule } from 'services/OfficeScheduleService';
import ROLES from 'constants/Roles';
import { handleErrors, handleErrorLoading } from 'utils/handleErrors';
import { AlertMessage, ModalLoading } from 'components';
import styles from './OfficeSchedulePage.module.css';

const OfficeSchedulePage = () => {

    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});
    const [offices, setOffices] = useState(null);
    const [selectOffice, setSelectOffice] = useState(null);
    const [allSchedules, setAllSchedules] = useState(null);
    const [schedules, setSchedules] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    // Estado para el modal de creación y actualización de información de usuarios
    const [show, setShow] = useState(false);

    // Estado para el mensaje de alerta
    const [alert, setAlert] = useState(null);

    // Estado para el modal de carga 
    const [isLoading, setIsLoading] = useState(null);

    useEffect(() => {
        if(getLocalUser().roles.includes(ROLES.SUPERADMIN) !== true) {
            setSelectOffice(getLocalUser().officeId);
            getScheduleByOfficeId(getLocalUser().officeId).then(res => setSchedules(res.data))
                .catch(err => handleErrorLoading(err, setErrorLoading));
        }
        else {
            getOfficesActiveAndInactive().then(res => setOffices(res.data))
                .catch(err => err);

            getAllSchedules().then(res => setAllSchedules(res.data))
                .catch(err => handleErrorLoading(err, setErrorLoading)); 
            setSelectOffice(0);
        }    
    }, []);

    // Funciones para cerrar y mostrar el modal
    const handleClose = () => { 
        setShow(false);
        setSelectedSchedule(null);
    }
    const handleShow = () => setShow(true);

    const showSchedules = (officeId) => {
        if(parseInt(officeId) !== 0) {
            getScheduleByOfficeId(parseInt(officeId))
                .then(res => setSchedules(res.data))
                .catch(err => handleErrorLoading(err, setErrorLoading));
        }
        else {
            getAllSchedules().then(res => setAllSchedules(res.data))
                .catch(err => handleErrorLoading(err, setErrorLoading));
        }
    }

    const handleSelectOffice = (e) => {
        setSelectOffice(parseInt(e.value));
        showSchedules(e.value);
    }

    const create = async(data) => {
        data.officeId = getLocalUser().roles.includes(ROLES.SUPERADMIN) ? parseInt(selectOffice) : getLocalUser().officeId;

        const result = await createSchedule(data);
        if(result.success && result.success === true) {
            addNewSchedule(data, result.data.id);
        }    

        setIsLoading({success: result.success});
        setAlert(result);

        return result;
    }

    const update = async(data) => {
        const result = await updateSchedule(data);
        if(result.success && result.success === true) {
            const newList = schedules.map(schedule => 
                schedule.scheduleId === data.scheduleId ? { ...schedule, ...data} : schedule    
            );
            setSchedules(newList);
        }    

        setIsLoading({success: result.success});
        setAlert(result);

        return result;
    }

    const saveSchedule = async(data, reset, type, setError) => {
        if(parseInt(data.weekDayId) === 0) {
            setError("weekDayId", {
                type: 'custom',
                message: 'Seleccione un día'
            });
            return;
        }

        const validation = validationSchedule(data, setError);
        if(validation === false) return;

        setIsLoading({success: undefined});
        let result = null;

        data.scheduleId = parseInt(data.scheduleId);
        data.officeId = parseInt(selectOffice);
        data.startHour = data.startHour === 'null' ? null : data.startHour;
        data.endHour = data.morningEndHour === 'null' ? null : data.endHour;
        data.isDeleted = parseInt(data.isDeleted) === 1 ? false : true;

        if(type === 'create') result = await create(data);
        else result = await update(data); 

        handleErrors(result, setAlert, setIsLoading);
        handleClose();
        reset();
        setSelectedSchedule(null);
    }

    const addNewSchedule = (data, newScheduleId) => {
        data.scheduleId = newScheduleId;

        const newList = [...schedules, data];
        const newListSort = newList.sort((a, b) => {
            if(a.weekDayId > b.weekDayId) return 1;

            if(a.weekDayId < b.weekDayId) return -1;

            return 0;
        });

        setSchedules(newListSort);
    }

    return (
        <>
            { isLoading ? (isLoading.success === undefined ? <ModalLoading show={true} /> : "") : ""}
            { /* Ventana modal para el registro, actualización y eliminación de dependiente  */
                show === true && (
                    <FormModal
                    handleClose={handleClose} 
                    show={show}
                    scheduleSelect={selectedSchedule}
                    schedules={schedules}
                    saveSchedule={saveSchedule} />         
                )
            }
            {
                getLocalUser().roles.includes(ROLES.SUPERADMIN) ? (
                    <h1 className={`page_title`}>Horarios de los Consultorios</h1>
                ):(
                    <h1 className={`page_title`}>
                        Horario del Consultorio de {getLocalUser()?.officeName}
                    </h1>
                ) 
            }
            <div className="underline mx-auto"></div>
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
                    getLocalUser().roles.includes(ROLES.SUPERADMIN) && (
                        offices && (
                            <FilterOffice 
                            className={styles.filter_office} 
                            offices={offices}
                            setSelectOffice={setSelectOffice}
                            handleSelectOffice={handleSelectOffice} />
                        )
                    )
                }

                { 
                    (selectOffice !== 0 && selectOffice !== null) ? (

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
                    getLocalUser().roles.includes(ROLES.SUPERADMIN) === true ? (
                        selectOffice === 0 ? (
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
                ):(
                    <h4 className={styles.text_error}>
                        {errorLoading.message}
                    </h4>
                )    
            }     
        </>
    );
}

export default OfficeSchedulePage;
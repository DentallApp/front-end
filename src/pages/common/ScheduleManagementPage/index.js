import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { IoAddCircle } from "react-icons/io5";
import moment from 'moment';
import { ScheduleTable, FilterDentist, FormModal } from './components';
import { validationScheduleMorning, validationScheduleAfternoon } from './utils';
import data from './data';
import styles from './ScheduleManagementPage.module.css';

const ScheduleManagementPage = () => {

    const [selectedDentist, setSelectedDentist] = useState(null);
    const [schedules, setSchedules] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    // Estado para el modal de creación y actualización de información de usuarios
    const [show, setShow] = useState(false);
    const [rowSelect, setRowSelect] = useState(null);

    useEffect(() => {
        setSchedules(data);
    }, []);

    // Funciones para cerrar y mostrar el modal
    const handleClose = () => { 
        setShow(false);
        setRowSelect(null);
    }
    const handleShow = () => setShow(true);

    const saveSchedule = (data, reset, type, setError) => {
        console.log(data);
        if(parseInt(data.dayId) === 0) {
            setError("dayId", {
                type: 'custom',
                message: 'Seleccione un día'
            });
            return;
        }

        const validationMorning = validationScheduleMorning(data, setError);
        const validationAfternoon = validationScheduleAfternoon(data, setError);

        if(validationMorning === false || validationAfternoon === false) return;

        handleClose();
        reset();
        setSelectedSchedule(null);
    }

    return (
        <>
            { /* Ventana modal para el registro, actualización y eliminación de dependiente  */
                show === true && (
                    <FormModal
                    handleClose={handleClose} 
                    show={show}
                    specificTreatmentSelect={rowSelect}
                    scheduleSelect={selectedSchedule}
                    saveSchedule={saveSchedule} />         
                )
            }    
            <h1 className={styles.page_title}>Gestión de Horarios</h1>

            <div className={styles.container_header}>
                <FilterDentist setSelectedDentist={setSelectedDentist} />
                
                <Button 
                className={styles.button_add} 
                onClick={() => {
                    handleShow();
                }}> 
                    <IoAddCircle className={styles.icon} /> Agregar horario
                </Button>
            </div>    
            <ScheduleTable 
            schedules={data}
            setSelectedSchedule={setSelectedSchedule}
            handleShow={handleShow}
             />
        </>
    );
}

export default ScheduleManagementPage;
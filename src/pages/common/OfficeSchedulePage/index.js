import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { IoAddCircle } from "react-icons/io5";
import moment from 'moment';
import { ScheduleTable, FilterOffice, FormModal } from './components';
import { validationSchedule } from './utils';
import data from './data';
import { getLocalUser } from '../../../services/UserService';
import ROLES from '../../../constants/Roles';
import '../../../App.css';
import styles from './OfficeSchedulePage.module.css';

const OfficeSchedulePage = () => {

    const [selectOffice, setSelectOffice] = useState(null);
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

        const validation = validationSchedule(data, setError);

        if(validation === false) return;

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
                    schedules={data}
                    saveSchedule={saveSchedule} />         
                )
            }
            {
                getLocalUser().roles.includes(ROLES.SUPERADMIN) ? (
                    <h1 className={`page_title`}>Gestión de Horarios de los Consultorios</h1>
                ):(
                    <h1 className={`page_title`}>
                        Horario del Consultorio de {getLocalUser().officeName}
                    </h1>
                ) 
            }    
            
            <div className={styles.container_header}>    
                {
                    getLocalUser().roles.includes(ROLES.SUPERADMIN) && (
                        <FilterOffice className={styles.filter_office} setSelectOffice={setSelectOffice} />
                    )
                }

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

export default OfficeSchedulePage;
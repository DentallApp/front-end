import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { IoAddCircle } from "react-icons/io5";
import { AlertMessage, ModalLoading } from 'components';
import { HoliDaysTable, FormModal, EliminationModal, OfficeFilter } from './components';
import listHolidays from './data';
import styles from './HoliDaysPage.module.css';

const HoliDaysPage = () => {

    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});

    const [holidays, setHolidays] = useState(listHolidays);
    const [filterHolidays, setFilterHolidays] = useState(listHolidays);
    const [holidaySelect, setHolidaySelect] = useState(null);
    const [valueSelected, setValueSelected] = useState(null);

    // Estado para el modal de creación y actualización de información de los días de feriados
    const [show, setShow] = useState(false);

    // Estado para el modal de eliminación de días de feriados 
    const [typeModal, setTypeModal] = useState('form');

    // Estado para el mensaje de alerta
    const [alert, setAlert] = useState(null);

    // Estado para el modal de carga 
    const [isLoading, setIsLoading] = useState(null);

    // Funciones para cerrar y mostrar el modal
    const handleClose = () => { 
        setShow(false);
        setHolidaySelect(null);
    }
    
    const handleShow = () => setShow(true);

    const handleChangeOffice = (e) => {
        setValueSelected(parseInt(e.value));
        if(parseInt(e.value) !== 0) {
            const filterData = holidays.filter(holiday => holiday.officeId === parseInt(e.value));
            setFilterHolidays(filterData);
            return;
        }
        setFilterHolidays(listHolidays);
    }

    const saveHoliday = (date, reset, type) => {
        console.log(date);

        handleClose();
        reset();
    }

    const eliminateHoliday = (id) => {
        console.log(id);
        handleClose();
    }

    return (
        <>
            { /* Ventana modal para el registro, actualización y eliminación de dependiente  */
                show === true ? (
                    typeModal === 'form' ? (
                        <FormModal 
                        handleClose={handleClose} 
                        show={show}
                        saveHoliday={saveHoliday}
                        holidaySelect={holidaySelect}
                        /> 
                    ):(
                        <EliminationModal
                        show={show}
                        handleClose={handleClose}
                        holidaySelect={holidaySelect}
                        eliminateHoliday={eliminateHoliday}
                        />
                    )
                ):<></>
            }
            <h1 className={'page_title'}>Configuración de Feriados</h1>
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
                <Button 
                className={styles.button_add} 
                onClick={() => {
                    setTypeModal('form');
                    handleShow();
                }}>
                    <IoAddCircle className={styles.icon} /> Nuevo
                </Button>
                <OfficeFilter 
                setValueSelected={setValueSelected}
                handleChangeOffice={handleChangeOffice}
                />    
            </div>

            {
                errorLoading.success === false ? (
                    holidays ? (
                        <HoliDaysTable 
                            styles="margin-bottom: 40px;" 
                            holidays={filterHolidays} 
                            handleShow={handleShow}
                            setTypeModal={setTypeModal}
                            setHolidaySelect={setHolidaySelect} />
                    ): 
                    (
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

export default HoliDaysPage;
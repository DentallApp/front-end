import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { IoAddCircle } from "react-icons/io5";
import { AlertMessage, ModalLoading } from 'components';
import { HoliDaysTable, FormModal, EliminationModal } from './components';
import { getHolidays, createHoliday, editHoliday, deleteHoliday } from 'services/HolidayService';
import { handleErrors, handleErrorLoading } from 'utils/handleErrors';
import styles from './HoliDaysPage.module.css';

const HoliDaysPage = () => {

    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});

    const [holidays, setHolidays] = useState([]);
    const [holidaySelect, setHolidaySelect] = useState(null);

    // Estado para el modal de creación y actualización de información de los días de feriados
    const [show, setShow] = useState(false);

    // Estado para el modal de eliminación de días de feriados 
    const [typeModal, setTypeModal] = useState('form');

    // Estado para el mensaje de alerta
    const [alert, setAlert] = useState(null);

    // Estado para el modal de carga 
    const [isLoading, setIsLoading] = useState(null);

    useEffect(() => {
        getHolidays()
            .then(res => {
                setHolidays(res.data);
            })
            .catch(err => handleErrorLoading(err, setErrorLoading));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Funciones para cerrar y mostrar el modal
    const handleClose = () => { 
        setShow(false);
        setHolidaySelect(null);
    }
    
    const handleShow = () => setShow(true);

    const create = async(holiday) => {
        const data = {
            day: holiday.day,
            month: holiday.month,
            description: holiday.description,
            officesId: holiday.officeId
        }

        const result = await createHoliday(data);
        if(result.success && result.success === true) {
            result.message = 'Feriado registrado con éxito';
            addNewHoliday(holiday, parseInt(result.data.id));
        }

        setIsLoading({success: result.success});
        setAlert(result);

        return result;
    }

    const edit = async(holiday) => {
        holiday.id = parseInt(holiday.id);

        const data = {
            id: holiday.id,
            day: holiday.day,
            month: holiday.month,
            description: holiday.description,
            officesId: holiday.officeId
        }

        const result = await editHoliday(data);
        if(result.success && result.success === true) {
            result.message = 'Datos actualizados con éxito';
            updateLocalData(holiday);
        }

        setIsLoading({success: result.success});
        setAlert(result);

        return result;
    }

    const saveHoliday = async(date, reset, type, setError) => {
        date.offices = date.officeId;
        date.officeId = date.officeId.map(office => parseInt(office.id));

        if(
            (type === 'create' && holidays.some(
            holiday => holiday.day === parseInt(date.date.split('-')[0])
            && holiday.month === parseInt(date.date.split('-')[1])
            && holiday.offices.some(office => date.officeId.includes(office.id))
            )) ||
            (type !== 'create' && holidays.some(
                holiday => parseInt(holiday.id) !== parseInt(date.id) &&
                holiday.day === parseInt(date.date.split('-')[0])
                && holiday.month === parseInt(date.date.split('-')[1])
                && holiday.offices.some(office => date.officeId.includes(office.id))
                )
            )) 
        {
            setError("date", {
                type: 'custom',
                message: 'Ya existe un feriado registrado en la fecha seleccionada para los consultorios seleccionados'
            });
            return;
        }

        setIsLoading({success: undefined});
        let result = null;

        date.day = parseInt(date.date.split('-')[0]);
        date.month = parseInt(date.date.split('-')[1]);

        if(type === 'create') result = await create(date);
        else result = await edit(date);

        handleErrors(result, setAlert, setIsLoading);
        handleClose();
        reset();
        setHolidaySelect(null);
    }

    const eliminateHoliday = async(id) => {
        setIsLoading({success: undefined});
        const result = await deleteHoliday(id);

        if(result.success && result.success === true) {
            result.message = 'Feriado eliminado con éxito';
            setHolidays(holidays.filter(holiday => holiday.id !== id));
        }

        setIsLoading({success: result.success});
        setAlert(result);
        handleErrors(result);
        
        handleClose();
        setHolidaySelect(null);
    }

    const addNewHoliday = (data, newHolidayId) => {
        data.id = newHolidayId;
        setHolidays([...holidays, data]);
    }

    const updateLocalData = (data) => {
        setHolidays(holidays.map(holiday => holiday.id === data.id ? {
            ...data
        }: holiday));
    }

    return (
        <>
            { isLoading ? (isLoading.success === undefined ? <ModalLoading show={true} /> : "") : ""}
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
            </div>

            {
                errorLoading.success === false ? (
                    holidays ? (
                        <HoliDaysTable 
                            styles="margin-bottom: 40px;" 
                            holidays={holidays} 
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
import { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Row, Col, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useWindowWidth } from '@react-hook/window-size';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import ContainerAvailableHours from '../ContainerAvailableHours';
import { getDentalServices, getDentistByOfficeAndService, getAvailabilityHours } from 'services/SchedulingService';
import Select from 'react-select';
import { AlertMessage } from 'components';
import { UNEXPECTED_ERROR } from 'constants/InformationMessage';
import { getLocalUser } from 'services/UserService';
import styles from './AppointmentModal.module.css';

const AppointmentModal = ({show, handleClose, createNewAppointment}) => {
    const [dentists, setDentists] = useState(null);
    const [services, setServices] = useState(null);
    const [availableHours, setAvailableHours] = useState(null);
    const [areSchedulesAvailable, setAreSchedulesAvailable] = useState(false);
    const selectDentistRef = useRef();
    const selectDateRef = useRef();
    const [alert, setAlert] = useState(null);
    const onlyWidth = useWindowWidth(); // Se obtiene ancho y altura de pantalla para colocar el modal

    const { register, handleSubmit, reset, setValue, watch, setError, clearErrors, formState: {errors} } = useForm({
        defaultValues: {
            dentistId: '',
            generalTreatmentId: '',
            officeId: '',
            appointmentDate: '',
            hours: ''
        }
    });

    const selectOffice = watch("officeId");
    const selectService = watch("generalTreatmentId");
    const selectDentist = watch("dentistId");
    const selectDate = watch("appointmentDate");

    useEffect(() => {
        register("officeId", {required: "Consultorio es requerido"});
        register("generalTreatmentId", {required: "Servicio dental es requerido"});
        register("dentistId", {required: "Odontólogo es requerido"});
        register("appointmentDate", {required: "Fecha es requerida"});
        register("hours", {required: "Hora de la cita es requerida"});

        setValue('officeId', getLocalUser().officeId, true);
        
        
        
        getDentalServices().then(res => setServices(res.data))
            .catch(err => handleErrorLoading(err));    
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Se invoca cada vez que se cambia la selección hecha en el combobox de servicio dental
    useEffect(() => {
        if(selectService !== '') {
            // Se verifica si hay ya cargadas horas disponibles de atención con respecto al servicio dental escogido
            // anteriormente. En caso de que haya se resetea a null el estado de horarios disponibles y el de fecha
            // se hace esto para que el usuario escoja de nuevo la fecha y se carguen los horarios disponibles
            // correspondientes al nuevo servicio elegido 
            if(availableHours !== null) {
                selectDateRef.current.value = null;
                setValue('appointmentDate', '', true);
                setValue('hours', '', true);
                setAvailableHours(null);
                setAreSchedulesAvailable(false);
            }

            if(selectDentist !== null && selectDentist !== '') {
                selectDentistRef.current.value = null;
                setValue('dentistId', null, true);
                setDentists(null);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, [selectService]);

    // Se invoca cada vez que se cambia la selección hecha en el combobox de odontologo
    useEffect(() => {
        // Se verifica si hay una fecha escogida previamente antes del cambio de elección en el combobox de odontologo
        // En caso de que si exista se resetea el valor guardado de la fecha, con el fin de que el usuario elija el 
        // día en que quiera que lo atendiera el nuevo odontologo escogido
        if(selectDateRef.current !== null && selectDateRef.current !== undefined) {
            selectDateRef.current.value = null;
            setValue('appointmentDate', '', true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps    
    }, [selectDentist]);

    // Se invoca cada vez que se cambia la selección hecha en el input de fecha
    useEffect(() => {
        // Se resetea las horas disponibles, para que así en cada cambio de fecha se carguen los horarios disponibles
        // correspondientes
        setAvailableHours(null);
        setAreSchedulesAvailable(false);
    }, [selectDate]);

    const handleSelectService = (e) => {
        clearErrors('generalTreatmentId');
        setValue('generalTreatmentId', parseInt(e.value), true);

        getDentistByOfficeAndService(getLocalUser().officeId, e.value)
            .then(res => {
                setDentists(res.data);

                if(res.data.length === 0) {
                    setError('generalTreatmentId', {
                        type: 'custom',
                        message: 'No hay odontólogos que puedan atender el servicio dental escogido'
                    })
                }
            })
            .catch(err => handleErrorLoading(err));
    }
    
    const handleSelectDentist = (e) => {
        clearErrors('dentistId');
        if(e !== null && e !== undefined) setValue('dentistId', parseInt(e.value), true);
    }

    const handleSelectDate = async (e) => {
        setValue('appointmentDate', e.target.value, true);
        const data = {
            officeId: selectOffice,
            dentistId: selectDentist,
            dentalServiceId: selectService,
            appointmentDate: e.target.value
        }
        
        const result = await getHoursAppointment(data);
        if(result.success === true) {
            clearErrors('appointmentDate');
            const newData = result.data.map(hours => {return {id: uuidv4(), ...hours}});
            setAreSchedulesAvailable(true);
            setAvailableHours(newData);
            return;
        }
        else {
            setValue('appointmentDate', '', true);
            setError('appointmentDate', {
                type: 'custom',
                message: 'Escoja otra fecha'
            });
        }   

        setAlert({success: result.success, message: result.message});
        handleErrors(result);
    }

    const getHoursAppointment = async (data) => {
        const result = await getAvailabilityHours(data);
        return result;
    }
    
    const handleErrorLoading = (err) => {
        if((err.response.status === 0 && err.response.data === undefined) || 
                (err.response.data.success === undefined && (err.response.status === 400 
                || err.response.status === 405 ||
                err.status === 500))) {
                setAlert({success: true, message: UNEXPECTED_ERROR});
                return;
        }  
    }

    const handleErrors = (result) => {
        if(result.success === undefined && (result.status === 0 || result.status === 400 || 
            result.status === 404 || result.status === 405 ||
            result.status === 500)) {
            setAlert({success: false, message: UNEXPECTED_ERROR});
        }
    }

    return (
        <Modal 
        show={show} 
        onHide={handleClose} 
        dialogClassName={styles.container_modal}
        aria-labelledby="example-custom-modal-styling-title"
        fullscreen={ onlyWidth < 768 ? true : false} 
        >
            <Modal.Header className={styles.container_header} closeButton>
                <Modal.Title>Agendamiento de cita</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form 
                className={styles.container_form} 
                onSubmit={handleSubmit((data) => createNewAppointment(data, reset))}>
                    <h2>Registro</h2>
                    <div className="underline mx-auto"></div>
                    <p className={styles.text_information}>Los campos con el símbolo * son obligatorios</p>
                    { /* Mensaje de alerta para mostrar información al usuario */
                        alert && 
                        <div className={styles.container_alert}>
                            <AlertMessage 
                            type={ alert.success === false ? 'danger' : 'success' }
                            message={ alert.message }
                            setError= { setAlert }  /> 
                        </div>
                    }
                    <Container>
                        <Row>
                            <Col sm={12} md>
                                <Form.Group className="mb-3" controlId="formBasicOffice">
                                    <Form.Label className={styles.label_input}>* Consultorio</Form.Label><br />
                                    <Form.Control 
                                    type="text" 
                                    value={getLocalUser().officeName}
                                    disabled
                                    />
                                    { errors.officeId && <p className={styles.error_message}>{ errors.officeId.message }</p> }
                                </Form.Group>
                            </Col>

                            <Col sm={12} md>
                                <Form.Group className="mb-3" controlId="formBasicService">
                                    <Form.Label className={styles.label_input}>* Servicio dental</Form.Label><br />
                                    {
                                        selectOffice === '' ? (
                                            <Select 
                                            placeholder={'Seleccione'}
                                            isDisabled={true}
                                            />
                                        ):(
                                            <> 
                                                { services !== null ? (
                                                    <>
                                                        <Select 
                                                            options={services !== null && services.map(service => {
                                                                return {
                                                                    value: service.value,
                                                                    label: service.title
                                                                }
                                                            })}
                                                            placeholder={'Seleccione'}
                                                            onChange={handleSelectService}
                                                            isDisabled={selectOffice === '' ? true : false}
                                                            noOptionsMessage={'No hay datos'}
                                                            className="basic-single"
                                                            classNamePrefix="select"
                                                            />
                                                            { 
                                                                errors.generalTreatmentId && <p className={styles.error_message}>
                                                                    { errors.generalTreatmentId.message }
                                                                </p> 
                                                            }
                                                    </>
                                                ): (
                                                    <p style={{'textAlign': 'center'}}>Cargando...</p>
                                                )}
                                            </>
                                        )
                                    }
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12} md>
                                <Form.Group className="mb-3" controlId="formBasicDentist">
                                    <Form.Label className={styles.label_input}>* Odontólogos</Form.Label><br />
                                    {
                                        (selectService === '' || dentists?.length === 0) ? (
                                            <>
                                                <Select 
                                                placeholder={'Seleccione'}
                                                isDisabled={true}
                                                />
                                                { 
                                                    errors.dentistId && <p className={styles.error_message}>
                                                        { errors.dentistId.message }
                                                    </p> 
                                                }
                                            </>
                                        ):(
                                            <>
                                                { (dentists && dentists?.length > 0) ? (
                                                    <>
                                                        <Select
                                                        ref={selectDentistRef}
                                                        options={dentists !== null && dentists.map(dentist => {
                                                            return {
                                                                value: dentist.value,
                                                                label: dentist.title
                                                            }
                                                        })}
                                                        placeholder={'Seleccione'}
                                                        onChange={handleSelectDentist}
                                                        isDisabled={selectService === '' ? true : false}
                                                        noOptionsMessage='No hay datos'
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        />
                                                        { 
                                                            errors.dentistId && <p className={styles.error_message}>
                                                                { errors.dentistId.message }
                                                            </p> 
                                                        }
                                                    </>
                                                ): (
                                                    <p style={{'textAlign': 'center'}}>Cargando...</p>
                                                )}
                                                
                                            </>
                                        )
                                    }
                                </Form.Group>
                            </Col>
                            <Col sm={12} md>
                                <Form.Group className="mb-3" controlId="formBasicDentist">
                                    <Form.Label className={styles.label_input}>* Fecha</Form.Label><br />
                                    {
                                        (selectDentist === '' || selectDentist === null) ? (
                                            <>
                                                <Form.Control 
                                                type="date"
                                                disabled
                                                />
                                                { 
                                                    errors.appointmentDate&& <p className={styles.error_message}>
                                                        { errors.appointmentDate.message }
                                                    </p> 
                                                }
                                            </>
                                        ):(
                                            <>
                                                <Form.Control
                                                ref={selectDateRef} 
                                                type="date"
                                                min={moment(new Date()).format('yyyy-MM-DD')}
                                                max={
                                                    moment(new Date())
                                                    .add(parseInt(process.env.REACT_APP_MAX_DAYS_IN_CALENDAR), "days")
                                                    .format('yyyy-MM-DD')
                                                }
                                                onChange={handleSelectDate} />
                                                { 
                                                    errors.appointmentDate&& <p className={styles.error_message}>
                                                        { errors.appointmentDate.message }
                                                    </p> 
                                                }
                                            </>
                                        )
                                    }
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} md>
                                { 
                                    (selectDate !== '' && areSchedulesAvailable === true) && (
                                        availableHours !== null ? (
                                            <>
                                                { errors.hours && <p className={styles.error_message}>{ errors.hours.message }</p> }
                                                <ContainerAvailableHours
                                                availableHours={availableHours}
                                                setValue={setValue} />
                                            </>
                                        ):(
                                            <div className={`${styles.container_spinner}`}>
                                                <Spinner size="lg" className={styles.spinner} animation="border" variant="info" />
                                                <p className={styles.text_loading}>Cargando...</p>
                                            </div>
                                        )
                                    )  
                                }
                            </Col>
                        </Row>
                    </Container>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cerrar
                        </Button>
                        <Button variant="primary" type="submit">
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
      </Modal>
    );
}

export default AppointmentModal;
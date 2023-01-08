import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useWindowWidth } from '@react-hook/window-size';
import STATUS from 'constants/Status';
import WEEKDAYS from 'constants/WeekDays';
import styles from './FormModal.module.css';

const FormModal = ({show, handleClose, scheduleSelect=null, saveSchedule, schedules}) => {
    
    const [type, setType] = useState('create'); // Estado para tipo de modal
    const [days, setDays] = useState(null);
    const onlyWidth = useWindowWidth(); // Se obtiene ancho y altura de pantalla para colocar el modal
    const [status, setStatus] = useState(null);

    const { register, handleSubmit, reset, setValue, watch, setError, formState: {errors} } = useForm({
        defaultValues: {
            scheduleId: `${ scheduleSelect !== null ? scheduleSelect.scheduleId : ""}`,
            weekDayId: `${ scheduleSelect !== null ? scheduleSelect.weekDayId : ""}`,
            morningStartHour: `${ scheduleSelect !== null ? scheduleSelect.morningStartHour : ""}`,
            morningEndHour: `${ scheduleSelect !== null ? scheduleSelect.morningEndHour : ""}`,
            afternoonStartHour: `${ scheduleSelect !== null ? scheduleSelect.afternoonStartHour : ""}`,
            afternoonEndHour: `${ scheduleSelect !== null ? scheduleSelect.afternoonEndHour : ""}`,
            statusId: `${ scheduleSelect !== null ? (scheduleSelect.isDeleted === false ? STATUS[0].id : STATUS[1].id): ""}`,
            status: `${ 
                scheduleSelect !== null ? 
                (scheduleSelect.isDeleted === false ? STATUS[0].name.toUpperCase() : STATUS[1].name.toUpperCase())
                : ""
            }`,
            weekDayName: `${ scheduleSelect !== null ? scheduleSelect.weekDayName : ""}`
        }
    });

    const selectDayValue = watch("weekDayId");
    const selectStatusValue = watch("statusId");

    useEffect(() => {
        setStatus(STATUS);
        const filterDays = WEEKDAYS.filter(day => !schedules?.some(schedule => schedule.weekDayId === day.id ));
        
        register('weekDayId', {required: 'Día es requerido'});

        if(scheduleSelect !== null) {
            const daySelect = WEEKDAYS.filter(day => day.id === scheduleSelect.weekDayId);
            const daysResult = [...filterDays, ...daySelect];
            const daysSort = daysResult.sort((a, b) => a.id - b.id);
            
            setDays(daysSort);
            setValue("weekDayId", scheduleSelect.weekDayId, true);
            setValue("statusId", scheduleSelect.isDeleted === false ? STATUS[0].id : STATUS[1].id, true);
            setType('edit');
        }
        else {
            setDays(filterDays);
            setValue("weekDayId", 0, true);
            setValue("statusId", STATUS[0].id, true);
            setValue("status", STATUS[0].name.toUpperCase(), true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDayChange = (e) => {
        setValue("weekDayName", e.target.options[e.target.selectedIndex].text, true);
        setValue("weekDayId", parseInt(e.target.value), true);
    }
    const handleStatusChange = (e) => {
        setValue("status", e.target.options[e.target.selectedIndex].text.toUpperCase(), true);
        setValue("statusId", parseInt(e.target.value), true);
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
                <Modal.Title>{ scheduleSelect === null ? 'Crear Horario' : 'Editar horario' }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form 
                className={styles.container_form} 
                onSubmit={handleSubmit((data) => {saveSchedule(data, reset, type, setError)})}>
                    <h2>Registro</h2>
                    <div className="underline mx-auto"></div>
                    <p className={styles.text_information}>Los campos con el símbolo * son obligatorios</p>
                    <Container>
                        <Row>
                            <Col lg={12} md>
                                <Form.Group className="mb-3" controlId="formBasicDay">
                                    <Form.Label className={styles.label_input}>* Días</Form.Label>
                                    <Form.Select
                                    name="weekDayId"
                                    value={selectDayValue} 
                                    onChange={handleDayChange}
                                    >
                                        <option value={0}>Seleccione</option>
                                        { days && (
                                            days.map(data => (
                                                <option 
                                                key={data.id} 
                                                value={data.id}>
                                                    {data.name}
                                                </option>
                                            ))
                                        )}
                                    </Form.Select>
                                    { errors.weekDayId && <p className={styles.error_message}>{ errors.weekDayId.message }</p> }
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col lg={12} md>
                                <div className={styles.group}>
                                    <h5 style={{"textAlign": "center"}}>Horario mañana</h5>
                                    <Row>
                                        <Col sm={12} md>
                                            <Form.Group className="m-3" controlId="formBasicStartTime">
                                                <Form.Label className={styles.label_input}>* Hora inicio</Form.Label>
                                                <Form.Control 
                                                type="time"
                                                min={process.env.REACT_APP_START_HOUR_MORNING}
                                                max={process.env.REACT_APP_END_HOUR_MORNING}
                                                {...register("morningStartHour")} />
                                                { errors.morningStartHour && 
                                                <p className={styles.error_message}>
                                                    { errors.morningStartHour.message }
                                                </p> }
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12} md>
                                            <Form.Group className="m-3" controlId="formBasicEndTime">
                                                <Form.Label className={styles.label_input}>* Hora fin</Form.Label>
                                                <Form.Control 
                                                type="time"
                                                min={process.env.REACT_APP_START_HOUR_MORNING}
                                                max={process.env.REACT_APP_END_HOUR_MORNING}
                                                {...register("morningEndHour")} />
                                                { errors.morningEndHour && 
                                                <p className={styles.error_message}>
                                                    { errors.morningEndHour.message }
                                                </p> }
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col lg={12} md>
                                <div className={styles.group}>
                                    <h5 style={{"textAlign": "center"}}>Horario tarde</h5>
                                    <Row>
                                        <Col sm={12} md>
                                            <Form.Group className="m-3" controlId="formBasicStatus">
                                                <Form.Label className={styles.label_input}>* Hora inicio</Form.Label>
                                                <Form.Control 
                                                type="time"
                                                min={process.env.REACT_APP_START_HOUR_AFTERNOON}
                                                max={process.env.REACT_APP_END_HOUR_AFTERNOON}
                                                {...register("afternoonStartHour")} />
                                                { errors.afternoonStartHour && 
                                                <p className={styles.error_message}>
                                                    { errors.afternoonStartHour.message }
                                                </p> }
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12} md>
                                            <Form.Group className="m-3" controlId="formBasicStatus">
                                                <Form.Label className={styles.label_input}>* Hora fin</Form.Label>
                                                <Form.Control 
                                                type="time"
                                                min={process.env.REACT_APP_START_HOUR_AFTERNOON}
                                                max={process.env.REACT_APP_END_HOUR_AFTERNOON}
                                                {...register("afternoonEndHour")} />
                                                { errors.afternoonEndHour && 
                                                <p className={styles.error_message}>
                                                    { errors.afternoonEndHour.message }
                                                </p> }
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>

                        {
                            type === 'edit' && (
                                <Row>
                                    <Col lg={12} md>
                                        <Form.Group className="mb-3" controlId="formBasicStatus">
                                            <Form.Label className={styles.label_input}>* Estado</Form.Label>
                                            <Form.Select
                                            name="statusId"
                                            value={selectStatusValue} 
                                            onChange={handleStatusChange}
                                            >
                                            { status && (
                                                status.map(data => (
                                                    <option 
                                                    key={data.id} 
                                                    value={data.id}>
                                                        {data.name}
                                                    </option>
                                                ))
                                            ) }
                                            </Form.Select>
                                            { errors.statusId && <p className={styles.error_message}>{ errors.statusId.message }</p> }
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )
                        }
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

export default FormModal;
import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useWindowWidth } from '@react-hook/window-size';
import STATUS from '../../../../../constants/Status';
import styles from './FormModal.module.css';

const dataDays = [
    {id: 1, name: 'Lunes'},
    {id: 2, name: 'Martes'},
    {id: 3, name: 'Miercoles'},
    {id: 4, name: 'Jueves'},
    {id: 5, name: 'Viernes'},
    {id: 6, name: 'Sabado'},
    {id: 7, name: 'Domingo'},
]; 

const FormModal = ({show, handleClose, scheduleSelect=null, saveSchedule, schedules}) => {

    const [type, setType] = useState('create'); // Estado para tipo de modal
    const [days, setDays] = useState(null);
    const onlyWidth = useWindowWidth(); // Se obtiene ancho y altura de pantalla para colocar el modal
    const [status, setStatus] = useState(null);

    const { register, handleSubmit, reset, setValue, watch, setError, formState: {errors} } = useForm({
        defaultValues: {
            scheduleId: `${ scheduleSelect !== null ? scheduleSelect.scheduleId : ""}`,
            dayId: `${ scheduleSelect !== null ? scheduleSelect.dayId : ""}`,
            startTime: `${ scheduleSelect !== null ? scheduleSelect.startTime : ""}`,
            endTime: `${ scheduleSelect !== null ? scheduleSelect.endTime : ""}`,
            statusId: `${ scheduleSelect !== null ? (scheduleSelect.status === false ? STATUS[0].id : STATUS[1].id): ""}`
        }
    });

    const selectDayValue = watch("dayId");
    const selectStatusValue = watch("statusId");

    useEffect(() => {
        setStatus(STATUS);
        const filterDays = dataDays.filter(day => !schedules.some(schedule => schedule.dayId === day.id ));
        setDays(filterDays);
        
        if(scheduleSelect !== null) {
            setValue("dayId", scheduleSelect.dayId, true);
            setValue("statusId", scheduleSelect.status === false ? STATUS[0].id : STATUS[1].id, true);
            setType('edit');
        }
        else {
            setValue("dayId", 0, true);
            setValue("statusId", STATUS[0].id, true);
        }
    }, []);

    const handleDayChange = (e) => setValue("dayId", e.target.value, true);
    const handleStatusChange = (e) => setValue("statusId", e.target.value, true);  

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
                onSubmit={handleSubmit((data) => saveSchedule(data, reset, type, setError))}>
                    <h2>Registro</h2>
                    <div className="underline mx-auto"></div>
                    <p className={styles.text_information}>Los campos con el símbolo * son obligatorios</p>
                    <Container>
                        <Row>
                            <Col lg={12} md>
                                <Form.Group className="mb-3" controlId="formBasicDay">
                                    <Form.Label className={styles.label_input}>* Días</Form.Label>
                                    <Form.Select
                                    name="dayId"
                                    value={selectDayValue} 
                                    onChange={handleDayChange}
                                    {...register("dayId", {
                                        required: "Debe de seleccionar un día"
                                    })}
                                    >
                                        <option value="0">Seleccione</option>
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
                                    { errors.dayId && <p className={styles.error_message}>{ errors.dayId.message }</p> }
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col lg={12} md>
                                <div className={styles.group}>
                                    <h5 style={{"textAlign": "center"}}>Horario</h5>
                                    <Row>
                                        <Col sm={12} md>
                                            <Form.Group className="m-3" controlId="formBasicStartTime">
                                                <Form.Label className={styles.label_input}>* Hora inicio</Form.Label>
                                                <Form.Control 
                                                type="time"
                                                {...register("startTime", {
                                                    required: "Hora de inicio es requerida"
                                                })} />
                                                { errors.startTime && 
                                                <p className={styles.error_message}>
                                                    { errors.startTime.message }
                                                </p> }
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12} md>
                                            <Form.Group className="m-3" controlId="formBasicEndTime">
                                                <Form.Label className={styles.label_input}>* Hora fin</Form.Label>
                                                <Form.Control 
                                                type="time"
                                                {...register("endTime", {
                                                    required: "Hora fin es requerida"
                                                })} />
                                                { errors.endTime && 
                                                <p className={styles.error_message}>
                                                    { errors.endTime.message }
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
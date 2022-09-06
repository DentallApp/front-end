import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Modal, Badge } from 'react-bootstrap';
import { useWindowWidth } from '@react-hook/window-size';
import { useForm } from 'react-hook-form';
import { getAppointmentStatus } from 'services/AppointmentStatusService';
import APPOINTMENT_STATUS from 'constants/AppointmentStatus';
import styles from './AppointmentModal.module.css';

const AppointmentModal = ({
    show, 
    handleClose,
    appointmentSelect,
    saveChanges
}) => {
    const onlyWidth = useWindowWidth(); // Se obtiene ancho y altura de pantalla para colocar el modal
    const [listStatus, setListStatus] = useState(null);

    const { register, handleSubmit, setValue, watch, formState: {errors} } = useForm();

    const selectStatusValue = watch("statusId");

    useEffect(() => {
        register("statusId", { required: "Estado de la cita es requerido" });
        setValue("statusId", appointmentSelect.event.extendedProps.statusId, true);
        
        getAppointmentStatus().then(res => {
            setListStatus(res.data.filter(status => status.id === APPOINTMENT_STATUS[0].id || 
                status.id === APPOINTMENT_STATUS[2].id || status.id === APPOINTMENT_STATUS[4].id));
        })
        .catch(err => err);
    }, []);

    const handleStatusChange = (e) => setValue("statusId", e.target.value, true); 

    return (
        <>   
            <Modal 
            show={show} 
            onHide={handleClose} 
            dialogClassName={styles.container_modal}
            aria-labelledby="example-custom-modal-styling-title"
            fullscreen={ onlyWidth < 768 ? true : false} 
            >
                <Modal.Header className={styles.container_header} closeButton>
                    <Modal.Title>Información de Cita</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form 
                    className={styles.container_form}
                    onSubmit={handleSubmit((data) => saveChanges(data))}>
                        <h2>CITA</h2>
                        <div className="underline mx-auto"></div>
                        <Container>
                            <Row>
                                <Col xs={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicPatient">
                                        <Form.Label className={styles.label_input}>Paciente</Form.Label>
                                        <p>{appointmentSelect.event.extendedProps.patient}</p>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicDentist">
                                        <Form.Label className={styles.label_input}>Dentista</Form.Label>
                                        <p>{appointmentSelect.event.extendedProps.dentist}</p>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicService">
                                        <Form.Label className={styles.label_input}>Servicio Dental</Form.Label>
                                        <p>{appointmentSelect.event.extendedProps.service}</p>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicOffice">
                                        <Form.Label className={styles.label_input}>Consultorio</Form.Label>
                                        <p>{appointmentSelect.event.extendedProps.officeName}</p>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicDate">
                                        <Form.Label className={styles.label_input}>Fecha y Hora de la Cita</Form.Label>
                                        <p>{appointmentSelect.event.extendedProps.dateAppointment}</p>
                                        <p style={{"fontWeight": "bold"}}>
                                            {appointmentSelect.event.extendedProps.startHour} - 
                                            {appointmentSelect.event.extendedProps.endHour}
                                        </p>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicStatus">
                                        <Form.Label className={styles.label_input}>Estado</Form.Label>
                                        {
                                            appointmentSelect.event.extendedProps.statusId !== 
                                            APPOINTMENT_STATUS[5].id ? (
                                                <Form.Select
                                                name="statusId"
                                                value={selectStatusValue} 
                                                onChange={handleStatusChange}
                                                >   
                                                { listStatus && (
                                                    listStatus.map(data => (
                                                        <option 
                                                        key={data.id} 
                                                        value={data.id}>
                                                            {data.name}
                                                        </option>
                                                    ))
                                                )}
                                                </Form.Select>
                                            ):(
                                                <div className={styles.badge_text}>
                                                    <Badge pill 
                                                    bg={
                                                        APPOINTMENT_STATUS.filter(status => 
                                                        status.id === appointmentSelect.event.extendedProps.statusId)[0].colorName
                                                    }>
                                                        {appointmentSelect.event.extendedProps.status.toUpperCase()}
                                                    </Badge>
                                                </div>
                                            )
                                        }
                                    </Form.Group>
                                </Col>
                            </Row> 
                        </Container>
                        
                        <Modal.Footer className={styles.container_footer}>
                            {
                                appointmentSelect.event.extendedProps.statusId !== 
                                APPOINTMENT_STATUS[5].id && (
                                    <Button 
                                    className={styles.button_cancel}
                                    type="submit"
                                    >
                                        Guardar
                                    </Button>
                                )
                            }     
                            <Button variant="secondary" onClick={handleClose}>
                                Salir
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default AppointmentModal;
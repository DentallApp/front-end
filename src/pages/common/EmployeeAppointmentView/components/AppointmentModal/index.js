import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Modal, Badge } from 'react-bootstrap';
import { useWindowWidth } from '@react-hook/window-size';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { getLocalUser } from 'services/UserService';
import APPOINTMENT_STATUS from 'constants/AppointmentStatus';
import ROLES from 'constants/Roles';
import styles from './AppointmentModal.module.css';

const AppointmentModal = ({
    show, 
    handleClose,
    appointmentSelect,
    saveChanges,
    listStatus
}) => {
    const onlyWidth = useWindowWidth(); // Se obtiene ancho y altura de pantalla para colocar el modal
    const [statusAppointment, setStatusAppointment] = useState(null);

    const { register, handleSubmit, setValue, watch} = useForm();

    const selectStatusValue = watch("statusId");

    useEffect(() => {
        register("statusId", { required: "Estado de la cita es requerido" });
        setValue("statusId", appointmentSelect.event.extendedProps.statusId, true);
        
        setStatusAppointment(listStatus.filter(status => status.id !== APPOINTMENT_STATUS[3].id));
        // eslint-disable-next-line react-hooks/exhaustive-deps    
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
                                        <p>{appointmentSelect.event.extendedProps.patientName}</p>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicDentist">
                                        <Form.Label className={styles.label_input}>N. Cedula</Form.Label>
                                        <p>{appointmentSelect.event.extendedProps.document}</p>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicDentist">
                                        <Form.Label className={styles.label_input}>Teléfono paciente</Form.Label>
                                        <p>{appointmentSelect.event.extendedProps.cellPhone}</p>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicService">
                                        <Form.Label className={styles.label_input}>Correo paciente</Form.Label>
                                        <p>{appointmentSelect.event.extendedProps.email}</p>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicDentist">
                                        <Form.Label className={styles.label_input}>Dentista</Form.Label>
                                        <p>{
                                        (getLocalUser().roles.includes(ROLES.SECRETARY) || getLocalUser().roles.includes(ROLES.ADMIN) || 
                                        getLocalUser().roles.includes(ROLES.SUPERADMIN)) ?
                                            appointmentSelect.event.extendedProps.dentistName :
                                            getLocalUser().fullName
                                        }</p>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicService">
                                        <Form.Label className={styles.label_input}>Servicio Dental</Form.Label>
                                        <p>{appointmentSelect.event.extendedProps.dentalServiceName}</p>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicOffice">
                                        <Form.Label className={styles.label_input}>Consultorio</Form.Label>
                                        <p>{appointmentSelect.event.extendedProps.officeName}</p>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicStatus">
                                        <Form.Label className={styles.label_input}>Estado</Form.Label>
                                        {
                                            (appointmentSelect.event.extendedProps.statusId !== 
                                            APPOINTMENT_STATUS[3].id && 
                                            moment(appointmentSelect.event.extendedProps.appointmentDate).format('yyyy-MM-DD') === moment().format('yyyy-MM-DD')) ? (
                                                <Form.Select
                                                name="statusId"
                                                value={selectStatusValue} 
                                                onChange={handleStatusChange}
                                                >   
                                                { statusAppointment && (
                                                    statusAppointment.map(data => (
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
                                                        status.name === appointmentSelect.event.extendedProps.status)[0].colorName
                                                    }>
                                                        {appointmentSelect.event.extendedProps.status.toUpperCase()}
                                                    </Badge>
                                                </div>
                                            )
                                        }
                                    </Form.Group>
                                </Col>
                            </Row> 
                            <Row>
                                <Col sm={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicDate">
                                        <Form.Label className={styles.label_input}>Fecha y Hora de la Cita</Form.Label>
                                        <p style={{"fontWeight": "bold"}}>
                                            {appointmentSelect.event.extendedProps.startHour} - 
                                            {appointmentSelect.event.extendedProps.endHour}
                                        </p>
                                        <p>{appointmentSelect.event.extendedProps.appointmentDate}</p>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Container>
                        
                        <Modal.Footer className={styles.container_footer}>
                            {
                                (appointmentSelect.event.extendedProps.statusId !== 
                                APPOINTMENT_STATUS[3].id &&
                                moment(appointmentSelect.event.extendedProps.appointmentDate).format('yyyy-MM-DD') === moment().format('yyyy-MM-DD')) 
                                && (
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
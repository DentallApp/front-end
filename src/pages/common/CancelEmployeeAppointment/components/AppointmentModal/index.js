import { Form, Button, Container, Row, Col, Modal, Badge } from 'react-bootstrap';
import { useWindowWidth } from '@react-hook/window-size';
import APPOINTMENT_STATUS from 'constants/AppointmentStatus';
import styles from './AppointmentModal.module.css';

const AppointmentModal = ({
    show, 
    handleClose,
    appointmentSelect,
}) => {
    const onlyWidth = useWindowWidth(); // Se obtiene ancho y altura de pantalla para colocar el modal

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
                    className={styles.container_form}>
                        <h2>CITA</h2>
                        <div className="underline mx-auto"></div>
                        <Container>
                            <Row>
                                <Col xs={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicPatient">
                                        <Form.Label className={styles.label_input}>Paciente</Form.Label>
                                        <p>{appointmentSelect.patient}</p>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicDentist">
                                        <Form.Label className={styles.label_input}>N. Cedula</Form.Label>
                                        <p>{appointmentSelect.document}</p>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicDentist">
                                        <Form.Label className={styles.label_input}>Dentista</Form.Label>
                                        <p>{appointmentSelect.dentist}</p>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicService">
                                        <Form.Label className={styles.label_input}>Servicio Dental</Form.Label>
                                        <p>{appointmentSelect.service}</p>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicDate">
                                        <Form.Label className={styles.label_input}>Fecha y Hora de la Cita</Form.Label>
                                        <p style={{"fontWeight": "bold"}}>
                                            {appointmentSelect.hour}
                                        </p>
                                        <p>{appointmentSelect.date}</p>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicStatus">
                                        <Form.Label className={styles.label_input}>Estado</Form.Label>
                                        <div className={styles.badge_text}>
                                            <Badge pill 
                                            bg={
                                                APPOINTMENT_STATUS.filter(status => 
                                                status.name === appointmentSelect.status)[0].colorName
                                            }>
                                                {appointmentSelect.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row> 
                        </Container>
                        
                        <Modal.Footer className={styles.container_footer}>    
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
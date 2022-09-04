import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Modal, Badge } from 'react-bootstrap';
import { useWindowWidth } from '@react-hook/window-size';
import { MdFreeCancellation } from "react-icons/md";
import moment from 'moment';
import EliminationModal from '../EliminationModal';
import APPOINTMENT_STATUS from 'constants/AppointmentStatus';
import { handleErrors } from 'utils/handleErrors';
import { deleteAppointment } from 'services/AppointmentBasicUserService';
import styles from './AppointmentModal.module.css';

const AppointmentModal = ({
    show, 
    handleClose, 
    setAppointmentSelect, 
    appointmentSelect,
    setAlert,
    setIsLoading,
    setIsChange,
    isChange 
}) => {
    const onlyWidth = useWindowWidth(); // Se obtiene ancho y altura de pantalla para colocar el modal
    const [showSubModal, setShowSubModal] = useState(false);
    const [dateAppointment, setDateAppointment] = useState(null);

    useEffect(() => {
        const date = new Date();
        let timeSplit = appointmentSelect.startHour.split(':');
        date.setHours(timeSplit[0]);
        date.setMinutes(timeSplit[1]);
        setDateAppointment(date);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Funciones para cerrar y mostrar el modal
    const handleSubModalClose = () => { 
        setShowSubModal(false);
    }
    const handleSubModalShow = () => setShowSubModal(true);

    const cancelAppointment = async (id) => {
        setIsLoading({success: undefined});
        const result = await deleteAppointment(parseInt(id));
        
        if(result.success && result.success === true) {
            setIsChange(!isChange);
            result.message = 'Cita cancelada exitosamente'  
        }

        setIsLoading({success: result.success});
        setAlert(result);

        handleErrors(result, setAlert, setIsLoading);

        setAppointmentSelect(null);
        setShowSubModal(false);
        handleClose();
    }

    return (
        <>
            { /* Ventana modal para el registro, actualización y eliminación de dependiente  */
                showSubModal === true && (
                    <EliminationModal 
                    handleClose={handleSubModalClose} 
                    show={showSubModal}
                    appointmentSelect={appointmentSelect}
                    cancelAppointment={cancelAppointment} />
                )
            }  
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
                                        <p>{appointmentSelect.patientName}</p>
                                        <p style={{"fontWeight":"bold"}}>({appointmentSelect.kinshipName})</p>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicDentist">
                                        <Form.Label className={styles.label_input}>Dentista</Form.Label>
                                        <p>{appointmentSelect.dentistName}</p>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicService">
                                        <Form.Label className={styles.label_input}>Servicio Dental</Form.Label>
                                        <p>{appointmentSelect.dentalServiceName}</p>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicOffice">
                                        <Form.Label className={styles.label_input}>Consultorio</Form.Label>
                                        <p>{appointmentSelect.officeName}</p>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicDate">
                                        <Form.Label className={styles.label_input}>Fecha y Hora de la Cita</Form.Label>
                                        <p style={{"fontWeight": "bold"}}>{moment(dateAppointment).format('HH:mm a')}</p>
                                        <p>{appointmentSelect.appointmentDate}</p>
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

                            <Row>
                                <Col lg={12} md>
                                    <Form.Group className="mb-3" controlId="formBasicDate">
                                        <Form.Label className={styles.label_input}>Fecha y Hora de Agendamiento</Form.Label>
                                        <p>{appointmentSelect.createdAt}</p>
                                    </Form.Group>
                                </Col>
                            </Row>    
                        </Container>
                        
                        <Modal.Footer className={styles.container_footer}>
                            {
                                appointmentSelect.status === APPOINTMENT_STATUS[0].name && (
                                    <Button 
                                    className={styles.button_cancel}
                                    onClick={() => handleSubModalShow()}>
                                        <MdFreeCancellation className={styles.icon} />
                                        Cancelar Cita
                                    </Button>
                                )
                            }     
                            <Button variant="secondary" onClick={handleClose}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default AppointmentModal;
import { Button, Modal } from 'react-bootstrap';
import styles from './EliminationModal.module.css';

const EliminationModal = ({show, handleClose, appointmentSelect, cancelAppointment}) => {
    return (
        <Modal
        show={show} 
        onHide={handleClose} 
        dialogClassName={styles.container_modal}>
            <Modal.Header className={styles.container_header} closeButton>
                <Modal.Title>Eliminar Cita</Modal.Title>
            </Modal.Header>
             <Modal.Body>
                ¿Estás seguro que quieres eliminar la cita programada para el servicio de: <br />
                {appointmentSelect.dentalServiceName}?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={() => cancelAppointment(appointmentSelect.appointmentId)}>
                    Eliminar
                </Button>
            </Modal.Footer>
      </Modal>
    );
}

export default EliminationModal;
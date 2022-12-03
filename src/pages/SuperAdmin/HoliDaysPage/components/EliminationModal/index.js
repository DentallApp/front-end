import { Button, Modal } from 'react-bootstrap';
import styles from '../FormModal/FormModal.module.css';

const EliminationModal = ({show, handleClose, holidaySelect, eliminateHoliday}) => {
    return (
        <Modal 
        show={show} 
        onHide={handleClose} 
        dialogClassName={styles.container_modal}>
            <Modal.Header className={styles.container_header} closeButton>
                <Modal.Title>Eliminar tratamiento</Modal.Title>
            </Modal.Header>
             <Modal.Body>
                Estás seguro que quieres eliminar el feriado del día:<br /> 
                {`${new Date().getFullYear()}-${holidaySelect.date}`}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={() => eliminateHoliday(parseInt(holidaySelect.id))}>
                    Eliminar
                </Button>
            </Modal.Footer>
      </Modal>
    );
}

export default EliminationModal;
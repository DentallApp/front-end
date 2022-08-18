import { Button, Modal } from 'react-bootstrap';
import styles from '../FormModal/FormModal.module.css';

const EliminationModal = ({show, handleClose, treatmentSelect, eliminateService}) => {
    return (
        <Modal 
        show={show} 
        onHide={handleClose} 
        dialogClassName={styles.container_modal}>
            <Modal.Header className={styles.container_header} closeButton>
                <Modal.Title>Eliminar tratamiento</Modal.Title>
            </Modal.Header>
             <Modal.Body>
                ¿Estás seguro que quieres eliminar el tratamiento:<br /> 
                {treatmentSelect.name}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={() => eliminateService(parseInt(treatmentSelect.id))}>
                    Eliminar
                </Button>
            </Modal.Footer>
      </Modal>
    );
}

export default EliminationModal;
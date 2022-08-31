import { Button, Modal } from 'react-bootstrap';
import styles from './EliminationModal.module.css';

const EliminationModal = ({show, handleClose, dentistSelect, eliminateFavoriteDentist}) => {
    return (
        <Modal 
        show={show} 
        onHide={handleClose} 
        dialogClassName={styles.container_modal}>
            <Modal.Header className={styles.container_header} closeButton>
                <Modal.Title>Quitar de favorito</Modal.Title>
            </Modal.Header>
             <Modal.Body>
                ¿Estás seguro que quieres quitar de favoritos al odontólogo:<br /> 
                {`${dentistSelect.fullName}?`}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={() => eliminateFavoriteDentist(dentistSelect)}>
                    Eliminar
                </Button>
            </Modal.Footer>
      </Modal>
    );
}

export default EliminationModal;
import { Button, Modal } from 'react-bootstrap';

const EliminationModal = ({show, handleClose, specificTreatmentSelect, eliminateService}) => {
    return (
        <Modal 
        show={show} 
        onHide={handleClose} 
        dialogClassName='container_modal'>
            <Modal.Header className='container_header' closeButton>
                <Modal.Title>Eliminar tratamiento</Modal.Title>
            </Modal.Header>
             <Modal.Body>
                ¿Estás seguro que quieres eliminar el tratamiento:<br /> 
                {specificTreatmentSelect.specificTreatmentName}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={() => eliminateService(parseInt(specificTreatmentSelect.specificTreatmentId))}>
                    Eliminar
                </Button>
            </Modal.Footer>
      </Modal>
    );
}

export default EliminationModal;
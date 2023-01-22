import { Button, Modal } from 'react-bootstrap';

const EliminationModal = ({show, handleClose, serviceSelect, eliminateService}) => {
    return (
        <Modal 
        show={show} 
        onHide={handleClose} 
        dialogClassName='container_modal'>
            <Modal.Header className='container_header' closeButton>
                <Modal.Title>Eliminar servicio</Modal.Title>
            </Modal.Header>
             <Modal.Body>
                ¿Estás seguro que quieres eliminar el servicio:<br /> 
                {serviceSelect.name}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={() => eliminateService(parseInt(serviceSelect.id))}>
                    Eliminar
                </Button>
            </Modal.Footer>
      </Modal>
    );
}

export default EliminationModal;
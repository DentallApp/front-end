import { Modal, Spinner } from 'react-bootstrap';
import styles from './ModalLoading.module.css';

const ModalLoading = ({ show }) => {
    return (
        <Modal
        show={show}
        backdrop="static"
        keyboard={false}
        centered
        >
            <Modal.Body className={styles.modal_info}>
                <div className={`${styles.container_spinner}`}>
                    <Spinner size="lg" className={styles.spinner} animation="border" variant="light" />
                    <p className={styles.text_loading}>Cargando...</p>
                </div>
            </Modal.Body>
      </Modal>
    );
}

export default ModalLoading;
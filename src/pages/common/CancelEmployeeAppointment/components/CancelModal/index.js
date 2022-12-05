import { Form, Button, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import styles from './CancelModal.module.css';

const CancelModal = ({show, handleClose, appointmentsForCancel, cancel}) => {

    const { register, handleSubmit, setError, formState: {errors} } = useForm();

    return (
        <Modal 
        show={show} 
        onHide={handleClose} 
        dialogClassName={styles.container_modal}>
            <Modal.Header className={styles.container_header} closeButton>
                <Modal.Title>Cancelar citas</Modal.Title>
            </Modal.Header>
             <Modal.Body>
                Esta a punto de cancelar las citas de los siguientes pacientes:<br /> 
                {
                    appointmentsForCancel.map(appointment => (
                        <p key={appointment.appointmentId}>📋 {appointment.patientName}</p>
                    ))
                }
                <br/>
                <Form
                className={styles.container_form} 
                onSubmit={handleSubmit((data) => cancel(data, setError))}
                >
                    <Form.Label>Motivo</Form.Label>
                    <Form.Control 
                    as="textarea" 
                    rows={5}
                    maxLength={200}
                    placeholder="Ingrese motivo de cancelación"
                    {...register("reason", {
                        required: "Motivo de cancelación es requerido",
                            minLength: {
                                value: 5,
                                message: "Motivo no válido" 
                            }
                    })} /> 
                    { errors.reason && <p className={styles.error_message}>{ errors.reason.message }</p> }

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Salir
                        </Button>
                        <Button variant="primary" type="submit">
                            Aceptar
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
      </Modal>
    );
}

export default CancelModal;
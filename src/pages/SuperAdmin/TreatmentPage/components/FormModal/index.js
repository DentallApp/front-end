import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useWindowWidth } from '@react-hook/window-size';
import { formatPrice } from '../../../../../utils/formatUtils';
import styles from './FormModal.module.css';

const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const FormModal = ({show, handleClose, treatmentSelect = null, saveTreatment}) => {
    
    const onlyWidth = useWindowWidth(); // Se obtiene ancho y altura de pantalla para colocar el modal
    const [type, setType] = useState('create');

    const { register, handleSubmit, reset, formState: {errors} } = useForm({
        defaultValues: {
            id: `${ treatmentSelect !== null ? treatmentSelect.id : ""}`,
            name: `${ treatmentSelect !== null ? treatmentSelect.name : ""}`,
            price: `${ treatmentSelect !== null ? formatter.format(treatmentSelect.price) : ""}`,
        }
    });

    useEffect(() => {
        if(treatmentSelect !== null) {
            setType('edit');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps      
    }, []);

    return (
        <Modal 
        show={show} 
        onHide={handleClose} 
        dialogClassName={styles.container_modal}
        aria-labelledby="example-custom-modal-styling-title"
        fullscreen={ onlyWidth < 768 ? true : false} 
        >
            <Modal.Header className={styles.container_header} closeButton>
                <Modal.Title>{ treatmentSelect === null ? 'Crear Tratamiento' : 'Editar información' }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form 
                className={styles.container_form} 
                onSubmit={handleSubmit((data) => saveTreatment(data, reset, type))}>
                    <h2>Registro</h2>
                    <div className="underline mx-auto"></div>
                    <p className={styles.text_information}>Los campos con el símbolo * son obligatorios</p>
                    <Container>
                        <Row>
                            <Col lg={12} md>
                                <Form.Group className="mb-3" controlId="formBasicName">
                                    <Form.Label className={styles.label_input}>* Tratamiento</Form.Label>
                                    <Form.Control 
                                    placeholder="Ingrese nombre del tratamiento"
                                    {...register("name", {
                                        required: "Nombre del tratamiento es requerido",
                                        minLength: {
                                            value: 2,
                                            message: "Nombre no válido" 
                                        }
                                    })} /> 
                                    { errors.name && <p className={styles.error_message}>{ errors.name.message }</p> } 
                                </Form.Group>
                            </Col>

                            <Col lg={12} md>
                                <Form.Group className="mb-3" controlId="formBasicPrice">
                                    <Form.Label className={styles.label_input}>* Precio</Form.Label>
                                    <Form.Control 
                                    
                                    {...register("price", {
                                        required: "Precio es requerido",
                                        pattern: {
                                            value: formatPrice,
                                            message: "Precio no válido"
                                        },
                                        minLength: {
                                            value: 1,
                                            message: "Precio debe de tener 1 dígito"
                                        },
                                    })} />
                                    { errors.price && <p className={styles.error_message}>{ errors.price.message }</p> }
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cerrar
                        </Button>
                        <Button variant="primary" type="submit">
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
      </Modal>
    );
}

export default FormModal;
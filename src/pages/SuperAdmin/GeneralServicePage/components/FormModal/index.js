import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useWindowWidth } from '@react-hook/window-size';
import { MinutesToHours } from 'utils/timeUtils';
import FORMAT_IMAGE from 'constants/FormatImage';
import styles from './FormModal.module.css';

const FormModal = ({show, handleClose, serviceSelect = null, saveService}) => {
    
    const onlyWidth = useWindowWidth(); // Se obtiene ancho y altura de pantalla para colocar el modal
    const [image, setImage] = useState(null);
    const [type, setType] = useState('create');

    const { register, handleSubmit, reset, setValue, setError,  formState: {errors} } = useForm({
        defaultValues: {
            id: `${ serviceSelect !== null ? serviceSelect.id : ""}`,
            name: `${ serviceSelect !== null ? serviceSelect.name : ""}`,
            description: `${ serviceSelect !== null ? (serviceSelect.description !== null ? serviceSelect.description : ""):""}`,
            duration: `${ serviceSelect !== null ? MinutesToHours(serviceSelect.duration) : ""}`,
            imageUrl: `${ serviceSelect !== null ? serviceSelect.imageUrl : ""}`,
        }
    });

    useEffect(() => {
        if(serviceSelect === null) {
            register("imageUrl", { required: "Imagen de servicio es requerida" });
        }    
        else {
            register("imageUrl");
            setType('edit');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps      
    }, []);

    const changeImage = (e) => {
        setImage(URL.createObjectURL(e.target.files[0]));

        if(e.target.files[0].type === FORMAT_IMAGE.PNG || e.target.files[0].type === FORMAT_IMAGE.JPG || 
            e.target.files[0].type === FORMAT_IMAGE.JPEG) {
                setValue("imageUrl", e.target.files, true);
        }
        else {
            type !== 'edit' ? setValue("imageUrl", null, true) : setValue("imageUrl", e.target.files, true);
            setError("imageUrl", {
                type: 'custom',
                message: "Formato de imagen no válido. Se acepta .png, .jpg, .jpeg"
            });
        }
    }

    return (
        <Modal 
        show={show} 
        onHide={handleClose} 
        dialogClassName={styles.container_modal}
        aria-labelledby="example-custom-modal-styling-title"
        fullscreen={ onlyWidth < 768 ? true : false} 
        >
            <Modal.Header className={styles.container_header} closeButton>
                <Modal.Title>{ serviceSelect === null ? 'Crear Servicio' : 'Editar información' }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form 
                className={styles.container_form} 
                onSubmit={handleSubmit((data) => saveService(data, reset, type, setError))}>
                    <h2>Registro</h2>
                    <div className="underline mx-auto"></div>
                    <p className={styles.text_information}>Los campos con el símbolo * son obligatorios</p>
                    <Container>
                        <Row>
                            <Col xs={12} md>
                                <Form.Group className="mb-3" controlId="formBasicName">
                                    <Form.Label className={styles.label_input}>* Servicio</Form.Label>
                                    <Form.Control 
                                    placeholder="Ingrese nombre del servicio"
                                    {...register("name", {
                                        required: "Nombre del servicio es requerido",
                                        minLength: {
                                            value: 2,
                                            message: "Nombre no válido" 
                                        }
                                    })} /> 
                                    { errors.name && <p className={styles.error_message}>{ errors.name.message }</p> } 
                                </Form.Group>
                            </Col>

                            <Col xs={12} md>
                                <Form.Group className="mb-3" controlId="formBasicTime">
                                    <Form.Label className={styles.label_input}>* Tiempo de duración</Form.Label>
                                    <Form.Control 
                                    type="time"
                                    {...register("duration", {
                                        required: "Tiempo de duración es requerido"
                                    })} />
                                    { errors.duration && <p className={styles.error_message}>{ errors.duration.message }</p> }
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col xs={12} md>
                                <Form.Group className="mb-3" controlId="formBasicDescription">
                                    <Form.Label className={styles.label_input}>* Descripción</Form.Label>
                                    <Form.Control as="textarea" rows={5}
                                    placeholder="Ingrese descripción del servicio"
                                    {...register("description", {
                                        required: "Descripción del servicio es requerido",
                                        minLength: {
                                            value: 5,
                                            message: "Descripción no válida" 
                                        }
                                    })} /> 
                                    { errors.description && <p className={styles.error_message}>{ errors.description.message }</p> } 
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={12} md>
                                <Form.Group className="mb-3" controlId="formBasicIamge">
                                    <Form.Label 
                                    className={styles.label_input}>
                                        { serviceSelect === null ? '* Imagen' : 'Imagen'}
                                    </Form.Label>
                                    <Form.Control 
                                    type="file"
                                    accept="image/png,image/jpg,image/jpeg"
                                    onChange={changeImage}
                                    placeholder="Ingrese imagen del servicio"
                                     /> 
                                    { errors.imageUrl && <p className={styles.error_message}>
                                        { errors.imageUrl.message }</p> } 
                                </Form.Group>
                            </Col>
                        </Row>

                        { image !== null && (
                            <Row>
                                <Col xs={12} md>
                                    <img className={styles.service_image} src={image} alt="Servicio"/>
                                </Col>
                            </Row>
                        )       
                        }
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
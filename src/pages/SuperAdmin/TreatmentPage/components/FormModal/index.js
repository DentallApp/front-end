import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useWindowWidth } from '@react-hook/window-size';
import { formatPrice } from 'utils/formatUtils';
import { getGeneralTreatmentName } from 'services/GeneralTreatments';
import styles from './FormModal.module.css';

const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const FormModal = ({show, handleClose, specificTreatmentSelect = null, saveTreatment}) => {
    
    const [services, setServices] = useState(null);
    const onlyWidth = useWindowWidth(); // Se obtiene ancho y altura de pantalla para colocar el modal
    const [type, setType] = useState('create');

    const { register, handleSubmit, reset, setValue, watch, formState: {errors} } = useForm({
        defaultValues: {
            specificTreatmentId: `${ specificTreatmentSelect !== null ? specificTreatmentSelect.specificTreatmentId : ""}`,
            name: `${ specificTreatmentSelect !== null ? specificTreatmentSelect.specificTreatmentName : ""}`,
            price: `${ specificTreatmentSelect !== null ? formatter.format(specificTreatmentSelect.price) : ""}`,
            generalTreatmentId: `${ specificTreatmentSelect !== null ? specificTreatmentSelect.generalTreatmentId : ""}`,
            generalTreatmentName: `${ specificTreatmentSelect !== null ? specificTreatmentSelect.generalTreatmentName : ""}`
        }
    });

    const selectValue = watch("generalTreatmentId");

    useEffect(() => {
        register("generalTreatmentId", { required: "Servicio dental es requerido" });   

        getGeneralTreatmentName().then(res => {
            setServices(res.data);

            if(specificTreatmentSelect === null) setValue("generalTreatmentId", res.data[0].id, true);
        })
        .catch(err => err); 

        if(specificTreatmentSelect !== null) {
            setValue("generalTreatmentId", specificTreatmentSelect.generalTreatmentId, true);
            setType('edit');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps      
    }, []);

    const handleChange = (e) => {
        setValue("generalTreatmentName", e.target.options[e.target.selectedIndex].text, true);
        setValue("generalTreatmentId", parseInt(e.target.value), true);
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
                <Modal.Title>{ specificTreatmentSelect === null ? 'Crear Tratamiento' : 'Editar información' }</Modal.Title>
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
                        </Row>

                        <Row>
                            <Col lg={12} md>
                                <Form.Group className="mb-3" controlId="formBasicPrice">
                                    <Form.Label className={styles.label_input}>* Precio</Form.Label>
                                    <Form.Control 
                                    placeholder="Ingrese precio"
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

                            <Col lg={12} md>
                                <Form.Group className="mb-3" controlId="formBasicService">
                                    <Form.Label className={styles.label_input}>* Servicios</Form.Label>
                                    <Form.Select
                                    name="generalTreatmentId"
                                    value={selectValue} 
                                    onChange={handleChange}
                                    >
                                        { services && (
                                            services.map(data => (
                                                <option 
                                                key={data.id} 
                                                value={data.id}>
                                                    {data.name}
                                                </option>
                                            ))
                                        ) }
                                    </Form.Select>
                                    { errors.generalTreatmentId && <p className={styles.error_message}>{ errors.generalTreatmentId.message }</p> }
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
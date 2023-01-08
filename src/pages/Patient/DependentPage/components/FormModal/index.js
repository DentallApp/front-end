import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useWindowWidth } from '@react-hook/window-size';
import moment from 'moment';
import { 
    formatEmail, 
    formatIdentityDocument, 
    formatNames,  
    formatPhone } from 'utils/formatUtils';
import styles from './FormModal.module.css';

const FormModal = ({show, handleClose, genders, kinship, dependentSelect = null, saveDependent}) => {
    const [type, setType] = useState('create'); // Estado para tipo de modal
    const onlyWidth = useWindowWidth(); // Se obtiene ancho y altura de pantalla para colocar el modal

    const { register, handleSubmit, reset, setValue, watch, setError,  formState: {errors} } = useForm({
        defaultValues: {
            dependentId: `${ dependentSelect !== null ? dependentSelect.dependentId : ""}`,
            names: `${ dependentSelect !== null ? dependentSelect.names : ""}`,
            lastNames: `${ dependentSelect !== null ? dependentSelect.lastNames : ""}`,
            cellPhone: `${ dependentSelect !== null ? dependentSelect.cellPhone : ""}`,
            document: `${ dependentSelect !== null ? dependentSelect.document : ""}`,
            email: `${ dependentSelect !== null ? dependentSelect.email : ""}`,
            dateBirth: `${ dependentSelect !== null ? moment(dependentSelect.dateBirth).format('yyyy-MM-DD') : ""}`,
            genderId: `${ dependentSelect !== null ? dependentSelect.genderId : ""}`,
            kinshipId: `${ dependentSelect !== null ? dependentSelect.kinshipId : ""}`,
        }
    });

    const selectValue = watch("kinshipId");

    useEffect(() => {
        register("kinshipId", { required: "Parentesco requerido" });

        if(dependentSelect !== null) {
            setValue("kinshipId", dependentSelect.kinshipId, true);
            setType('edit');
        }
        else {
            if(kinship !== null) setValue("kinshipId", kinship[0].id,true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        setValue("kinshipId", e.target.value, true);
        
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
                <Modal.Title>{ dependentSelect === null ? 'Crear Dependiente' : 'Editar información' }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form 
                className={styles.container_form} 
                onSubmit={handleSubmit((data) => saveDependent(data, reset, type, setError))}>
                    <h2>Registro</h2>
                    <div className="underline mx-auto"></div>
                    <p className={styles.text_information}>Los campos con el símbolo * son obligatorios</p>
                    <Container>
                    <Row>
                        <Col xs={12} md>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label className={styles.label_input}>* Nombre</Form.Label>
                                <Form.Control 
                                placeholder="Ingrese nombre"
                                {...register("names", {
                                    required: "Nombre es requerido",
                                    pattern: {
                                        value: formatNames,
                                        message: "Nombre no válido"
                                    },
                                    minLength: {
                                        value: 2,
                                        message: "Nombre no válido" 
                                    }
                                })} /> 
                                { errors.names && <p className={styles.error_message}>{ errors.names.message }</p> } 
                            </Form.Group>
                        </Col>

                    <Col xs={12} md>
                        <Form.Group className="mb-3" controlId="formBasicLastName">
                            <Form.Label className={styles.label_input}>* Apellidos</Form.Label>
                            <Form.Control 
                            type="text" 
                            placeholder="Ingrese apellidos"
                            {...register("lastNames", {
                                required: "Apellidos requeridos",
                                pattern: {
                                    value: formatNames,
                                    message: "Apellidos no válidos"
                                },
                                minLength: 2
                            })} />
                            { errors.lastNames && <p className={styles.error_message}>{ errors.lastNames.message }</p> }
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col xs={12} md>
                        <Form.Group className="mb-3" controlId="formBasicPhone">
                            <Form.Label className={styles.label_input}>* Teléfono</Form.Label>
                            <Form.Control 
                            type="number" 
                            placeholder="Ingrese número de celular"
                            {...register("cellPhone", {
                                required: "Número de celular requerido",
                                pattern: {
                                    value: formatPhone,
                                    message: "Número de celular no válido"
                                },
                                minLength: {
                                    value: 10,
                                    message: "Número de celular debe de tener 10 dígitos"
                                },
                                maxLength: {
                                    value: 10,
                                    message: "Número de celular debe de tener 10 dígitos"
                                }
                            })} />
                            { errors.cellPhone && <p className={styles.error_message}>{ errors.cellPhone.message }</p> } 
                        </Form.Group>
                    </Col>

                    <Col xs={12} md>
                        <Form.Group className="mb-3" controlId="formBasicId">
                            <Form.Label className={styles.label_input}>* Cedula</Form.Label>
                            <Form.Control
                            disabled={dependentSelect !== null ? true : false}
                            type="number" 
                            placeholder="Ingrese número de cedula"
                            {...register("document", {
                                required: "Cedula requerida",
                                pattern: {
                                    value: formatIdentityDocument,
                                    message: "Número de cédula inválido"
                                }
                            })} />
                            { errors.document && <p className={styles.error_message}>{ errors.document.message }</p> }
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col xs={12} md>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label className={styles.label_input}>Correo</Form.Label>
                            <Form.Control 
                            type="email" 
                            placeholder="Ingrese correo electrónico"
                            {...register("email", { 
                                pattern: {
                                    value: formatEmail,
                                    message: "Correo electrónico no válido"
                                } 
                            })} />
                            { errors.email && <p className={styles.error_message}>{ errors.email.message }</p> }  
                        </Form.Group>
                    </Col>

                    <Col xs={12} md>
                        <Form.Group className="mb-3" controlId="formBasicDate">
                            <Form.Label className={styles.label_input}>* Fecha de nacimiento</Form.Label>
                            <Form.Control 
                            type="date"
                            max={moment().format('yyyy-MM-DD')}
                            {...register("dateBirth", {
                                required: "Fecha de nacimiento requerida"
                            })} />
                            { errors.dateBirth && <p className={styles.error_message}>{ errors.dateBirth.message }</p> }
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col xs={12} md>
                        <Form.Group className="mb-3" controlId="formBasicGender">
                            <Form.Label className={styles.label_input}>* Género</Form.Label>
                            { genders && (
                                genders.map(gender => (
                                    <Form.Check
                                    key={gender.id} 
                                    type="radio" 
                                    label={gender.name}
                                    id={gender.name}
                                    value={gender.id}
                                    name="gender"
                                    {...register("genderId", {required: "Género es requerido"})} />
                                ))
                            ) }
                            { errors.genderId && <p className={styles.error_message}>{ errors.genderId.message }</p> }
                        </Form.Group>
                    </Col>

                    <Col xs={12} md>
                        <Form.Group className="mb-3" controlId="formBasicDate">
                            <Form.Label className={styles.label_input}>* Parentesco</Form.Label>
                            <Form.Select
                            name="kinshipId"
                            value={selectValue} 
                            onChange={handleChange}
                            >
                            { kinship && (
                                kinship.map(data => (
                                    <option 
                                    key={data.id} 
                                    value={data.id}>
                                        {data.name}
                                    </option>
                                ))
                            ) }
                            </Form.Select>
                            { errors.kinshipId && <p className={styles.error_message}>{ errors.kinshipId.message }</p> }
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
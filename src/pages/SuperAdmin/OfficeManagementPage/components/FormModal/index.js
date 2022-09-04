import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useWindowWidth } from '@react-hook/window-size';
import STATUS from 'constants/Status';
import { formatPhone } from 'utils/formatUtils';
import styles from './FormModal.module.css';

const FormModal = ({show, handleClose, officeSelect=null, saveOffice}) => {
    const onlyWidth = useWindowWidth(); // Se obtiene ancho y altura de pantalla para colocar el modal
    const [type, setType] = useState('create');
    const [status, setStatus] = useState(null);
    const [showDisableAccounts, setShowDisableAccounts] = useState(false);

    const { register, handleSubmit, reset, setValue, watch, formState: {errors} } = useForm({
        defaultValues: {
            id: `${ officeSelect !== null ? officeSelect.id : ""}`,
            name: `${ officeSelect !== null ? officeSelect.name : ""}`,
            address: `${ officeSelect !== null ? officeSelect.address : ""}`,
            contactNumber: `${ officeSelect !== null ? (officeSelect.contactNumber ? officeSelect.contactNumber : '') : ""}`,
            isDeleted: `${ officeSelect !== null ? (officeSelect.isDeleted === false ? STATUS[0].id : STATUS[1].id): ""}`,
            isCheckboxTicked: `${ officeSelect !== null ? officeSelect.isCheckboxTicked : "" }`,
        }
    });

    const selectStatusValue = watch("isDeleted");

    useEffect(() => {
        setStatus(STATUS);
        
        if(officeSelect !== null) {
            setValue("isDeleted", officeSelect.isDeleted === false ? STATUS[0].id : STATUS[1].id, true);
            setValue("isCheckboxTicked", officeSelect.isCheckboxTicked, true);
            setType('edit');
        }
        else {
            setValue("isDeleted", STATUS[0].id, true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleStatusChange = (e) => {
        setValue("isDeleted", e.target.value, true);

        if(parseInt(e.target.value) === 2) setShowDisableAccounts(true);
        else setShowDisableAccounts(false);
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
                <Modal.Title>{ officeSelect === null ? 'Crear Consultorio' : 'Editar información' }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form 
                className={styles.container_form} 
                onSubmit={handleSubmit((data) => saveOffice(data, reset, type))}>
                    <h2>Registro</h2>
                    <div className="underline mx-auto"></div>
                    <p className={styles.text_information}>Los campos con el símbolo * son obligatorios</p>
                    <Container>
                        <Row>
                            <Col lg={12} md>
                                <Form.Group className="mb-3" controlId="formBasicName">
                                    <Form.Label className={styles.label_input}>* Consultorio</Form.Label>
                                    <Form.Control 
                                    placeholder="Ingrese nombre del consultorio"
                                    {...register("name", {
                                        required: "Nombre del consultorio es requerido",
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
                                <Form.Group className="mb-3" controlId="formBasicAddress">
                                    <Form.Label className={styles.label_input}>* Dirección</Form.Label>
                                    <Form.Control 
                                    placeholder="Ingrese dirección"
                                    {...register("address", {
                                        required: "Dirección es requerida",
                                        minLength: {
                                            value: 2,
                                            message: "Dirección no válida" 
                                        }
                                    })} />
                                    { errors.address && <p className={styles.error_message}>{ errors.address.message }</p> }
                                </Form.Group>
                            </Col>

                            <Col lg={12} md>
                                <Form.Group className="mb-3" controlId="formBasicCellPhone">
                                    <Form.Label className={styles.label_input}>Teléfono</Form.Label>
                                    <Form.Control 
                                    placeholder="Ingrese número de teléfono"
                                    {...register("contactNumber", {
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
                                    { errors.contactNumber && <p className={styles.error_message}>{ errors.contactNumber.message }</p> }
                                </Form.Group>
                            </Col>
                        </Row>

                        {
                            type === 'edit' && (
                                <Row>
                                    <Col lg={12} md>
                                        <Form.Group className="mb-3" controlId="formBasicStatus">
                                            <Form.Label className={styles.label_input}>* Estado</Form.Label>
                                            <Form.Select
                                            name="isDeleted"
                                            value={selectStatusValue} 
                                            onChange={handleStatusChange}
                                            >
                                            { status && (
                                                status.map(data => (
                                                    <option 
                                                    key={data.id} 
                                                    value={data.id}>
                                                        {data.name}
                                                    </option>
                                                ))
                                            ) }
                                            </Form.Select>
                                            { errors.isDeleted && <p className={styles.error_message}>{ errors.isDeleted.message }</p> }
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )
                        }

                        {
                            (type === 'edit' && (showDisableAccounts === true || parseInt(selectStatusValue) === 2)) && (
                                <Row>
                                    <Col lg={12} md>
                                        <Form.Group className="mb-3" controlId="formBasicStatus">
                                        <Form.Check
                                        type='checkbox'
                                        label='Deshabilitar las cuentas de usuario del consultorio'
                                        {...register("isCheckboxTicked")}
                                        />
                                            { 
                                                errors.isCheckboxTicked && 
                                                <p className={styles.error_message}>
                                                    { errors.isCheckboxTicked.message }
                                                </p> 
                                            }
                                        </Form.Group>
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
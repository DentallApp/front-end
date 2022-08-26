import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useWindowWidth } from '@react-hook/window-size';
import STATUS from '../../../../../constants/Status';
import { formatPhone } from '../../../../../utils/formatUtils';
import styles from './FormModal.module.css';

const FormModal = ({show, handleClose, officeSelect=null, saveOffice}) => {
    const onlyWidth = useWindowWidth(); // Se obtiene ancho y altura de pantalla para colocar el modal
    const [type, setType] = useState('create');
    const [status, setStatus] = useState(null);
    const [showDisableAccounts, setShowDisableAccounts] = useState(false);

    const { register, handleSubmit, reset, setValue, watch, formState: {errors} } = useForm({
        defaultValues: {
            officeId: `${ officeSelect !== null ? officeSelect.officeId : ""}`,
            officeName: `${ officeSelect !== null ? officeSelect.officeName : ""}`,
            address: `${ officeSelect !== null ? officeSelect.address : ""}`,
            cellPhone: `${ officeSelect !== null ? officeSelect.cellPhone : ""}`,
            statusId: `${ officeSelect !== null ? (officeSelect.status === false ? STATUS[0].id : STATUS[1].id): ""}`,
            disableAccounts: `${ officeSelect !== null && false }`,
        }
    });

    const selectStatusValue = watch("statusId");

    useEffect(() => {
        setStatus(STATUS);
        
        if(officeSelect !== null) {
            setValue("statusId", officeSelect.isDeleted === false ? STATUS[0].id : STATUS[1].id, true);
            setValue("disableAccounts", false, true);
            setType('edit');
        }
        else {
            setValue("statusId", STATUS[0].id, true);
        }
    }, []);

    const handleStatusChange = (e) => {
        setValue("statusId", e.target.value, true);

        if(parseInt(e.target.value) === 2) {
            setShowDisableAccounts(true);
        }
        else {
            setShowDisableAccounts(false);
            setValue("disableAccounts", false, true);
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
                                    {...register("officeName", {
                                        required: "Nombre del consultorio es requerido",
                                        minLength: {
                                            value: 2,
                                            message: "Nombre no válido" 
                                        }
                                    })} /> 
                                    { errors.officeName && <p className={styles.error_message}>{ errors.officeName.message }</p> } 
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
                                    {...register("cellPhone", {
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
                        </Row>

                        {
                            type === 'edit' && (
                                <Row>
                                    <Col lg={12} md>
                                        <Form.Group className="mb-3" controlId="formBasicStatus">
                                            <Form.Label className={styles.label_input}>* Estado</Form.Label>
                                            <Form.Select
                                            name="statusId"
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
                                            { errors.statusId && <p className={styles.error_message}>{ errors.statusId.message }</p> }
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )
                        }

                        {
                            (type === 'edit' && (showDisableAccounts === true || selectStatusValue == 2)) && (
                                <Row>
                                    <Col lg={12} md>
                                        <Form.Group className="mb-3" controlId="formBasicStatus">
                                        <Form.Check
                                        type='checkbox'
                                        label='Deshabilitar las cuentas de usuario del consultorio'
                                        {...register("disableAccounts")}
                                        />
                                            { errors.disableAccounts && <p className={styles.error_message}>{ errors.disableAccounts.message }</p> }
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
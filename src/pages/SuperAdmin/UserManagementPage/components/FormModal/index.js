import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Modal, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useWindowWidth } from '@react-hook/window-size';
import moment from 'moment';
import Select from 'react-select';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { 
    formatEmail,
    formatPassword, 
    formatIdentityDocument, 
    formatNames,  
    formatPhone } from '../../../../../utils/formatUtils';
import { getGenders } from '../../../../../services/GenderService';
import styles from './FormModal.module.css';

/* Consultorios para test */
const officeData = [
    {officeId: 1, officeName: 'Mapasingue'},
    {officeId: 2, officeName: 'Rcto. El Piedrero'},
    {officeId: 3, officeName: 'Rosario'}
]

/* Roles para test */
const roles = [
    {roleId:10, roleName: 'Usuario básico'},
    {roleId:12, roleName: 'Odontólogo'},
    {roleId:13, roleName: 'Secretaria'},
    {roleId:14, roleName: 'Administrador'},
    {roleId:15, roleName: 'Superadministrador'},
];

const FormModal = ({show, handleClose, userSelect = null, saveUser}) => {

    const [passwordShow, setPasswordShow] = useState(false); // Estado para la acción de mostrar contraseña
    const [genders, setGenders] = useState(null); // Estado para los géneros
    const [office, setOffice] = useState(null); // Estado para el parentesco
    const [type, setType] = useState('create'); // Estado para tipo de modal
    const onlyWidth = useWindowWidth(); // Se obtiene ancho y altura de pantalla para colocar el modal

    const { register, handleSubmit, reset, setValue, watch,  formState: {errors} } = useForm({
        defaultValues: {
            id: `${ userSelect !== null ? userSelect.userId : ""}`,
            names: `${ userSelect !== null ? userSelect.names : ""}`,
            lastNames: `${ userSelect !== null ? userSelect.lastNames : ""}`,
            cellPhone: `${ userSelect !== null ? userSelect.cellPhone : ""}`,
            document: `${ userSelect !== null ? userSelect.document : ""}`,
            email: `${ userSelect !== null ? userSelect.email : ""}`,
            password: `${ userSelect !== null ? userSelect.password : ""}`,
            dateBirth: `${ userSelect !== null ? moment(userSelect.dateBirth).format('yyyy-MM-DD') : ""}`,
            genderId: `${ userSelect !== null ? userSelect.genderId : ""}`,
            officeId: `${ userSelect !== null ? userSelect.officeId : ""}`,
            pregrade_university: `${ userSelect !== null ? userSelect.pregrade_university : ""}`,
            postgrade_university: `${ userSelect !== null ? userSelect.postgrade_university : ""}`,
        }
    });

    const selectValue = watch("officeId");
    const roleValue = watch("roleId");

    useEffect(() => {
        getGenders().then(response => setGenders(response.data))
            .catch(error => console.error(error));

        // Para test
        setOffice(officeData);

        register("officeId", { required: "Consultorio requerido" });
        register("roleId", { required: "Rol es requerido" });
        
        if(userSelect !== null) {
            setValue("officeId", userSelect.officeId, true);
            setValue("roleId", userSelect.roles.map(role => role.id ), true);
            setType('edit');
        }
    }, []);

    useEffect(() => {
        if(office !== null && selectValue === '') setValue("officeId", officeData[0].officeId, true);
    }, [office]);

    const handleChange = (e) => setValue("officeId", e.target.value, true);
    
    const handleSelectRole = (e) => setValue("roleId", e.map(role => role.value ), true)    
    
    return (
        <Modal 
        show={show} 
        onHide={handleClose} 
        dialogClassName={styles.container_modal}
        aria-labelledby="example-custom-modal-styling-title"
        fullscreen={ onlyWidth < 768 ? true : false} 
        >
            <Modal.Header className={styles.container_header} closeButton>
                <Modal.Title>{ userSelect === null ? 'Crear Usuario' : 'Editar información' }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form 
                className={styles.container_form} 
                onSubmit={handleSubmit((data) => saveUser(data, reset, type))}>
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
                                    disabled={userSelect !== null ? true : false}
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
                                    <Form.Label className={styles.label_input}>* Correo</Form.Label>
                                    <Form.Control 
                                    type="email" 
                                    placeholder="Ingrese correo electrónico"
                                    {...register("email", {
                                        required: "Correo requerido", 
                                        pattern: {
                                            value: formatEmail,
                                            message: "Correo electrónico no válido"
                                        } 
                                    })} />
                                    { errors.email && <p className={styles.error_message}>{ errors.email.message }</p> }  
                                </Form.Group>
                            </Col>
                            
                            <Col xs={12} md>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label className={styles.label_input}>Contraseña</Form.Label>
                                    <InputGroup className="mb-1">
                                        <Form.Control 
                                        className={`${styles.form_control} ${styles.form_control_password}`} 
                                        type={passwordShow ? "text" : "password"} 
                                        {...register("password", { 
                                            required: "Contraseña es requerida",
                                            pattern: {
                                                value: formatPassword,
                                                message: "La contraseña contiene caracteres no permitidos"
                                            },
                                            minLength: {
                                                value: 5,
                                                message: "La contraseña debe de tener mínimo 5 carácteres"
                                            }
                                        })}
                                        placeholder="Ingrese contraseña" />
                                        <Button 
                                        className={styles.button_visible}
                                        onClick={() => setPasswordShow(!passwordShow)}>
                                            {passwordShow ? <MdVisibilityOff /> : <MdVisibility />}
                                        </Button>   
                                    </InputGroup>
                                    { errors.password && <p className={styles.error_message}>{ errors.password.message }</p> } 
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
                                    <Form.Label className={styles.label_input}>* Fecha de nacimiento</Form.Label>
                                    <Form.Control 
                                    type="date"
                                    {...register("dateBirth", {
                                        required: "Fecha de nacimiento requerida"
                                    })} />
                                    { errors.dateBirth && <p className={styles.error_message}>{ errors.dateBirth.message }</p> }
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={12} md>
                                <Form.Group className="mb-3" controlId="formBasicOffice">
                                    <Form.Label className={styles.label_input}>* Consultorio</Form.Label>
                                    <Form.Select
                                    name="officeId"
                                    value={selectValue} 
                                    onChange={handleChange}
                                    >
                                    { office && (
                                        office.map(data => (
                                            <option 
                                            key={data.officeId} 
                                            value={data.officeId}>
                                                {data.officeName}
                                            </option>
                                        ))
                                    ) }
                                    </Form.Select>
                                    { errors.officeId && <p className={styles.error_message}>{ errors.officeId.message }</p> }
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={12} md>
                                <Form.Group className="mb-3" controlId="formBasicRole">
                                    <Form.Label className={styles.label_input}>* Roles</Form.Label><br />
                                    <Select
                                    defaultValue={userSelect !== null && userSelect.roles.map(r => {return {value:r.id, label: r.name}})}
                                    isMulti
                                    name="colors"
                                    options={roles.map(role => {return {value: role.roleId, label: role.roleName, color: '#00B8D9'}})}
                                    onChange={handleSelectRole}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    />
                                    { errors.roleId && <p className={styles.error_message}>{ errors.roleId.message }</p> }
                                </Form.Group>
                            </Col>
                        </Row>
                       
                        <Row>
                            <Col lg={12} md>
                                <Form.Group className="mb-3" controlId="formBasicPregradeUniversity">
                                    <Form.Label className={styles.label_input}>Universidad pregrado</Form.Label>
                                    <Form.Control 
                                    placeholder="Ingrese universidad de pregrado"
                                    {...register("pregrade_university", {
                                        minLength: {
                                            value: 2,
                                            message: "Nombre de universidad no válido" 
                                        }
                                    })} /> 
                                    { errors.pregrade_university && <p className={styles.error_message}>
                                        { errors.pregrade_university.message }</p> } 
                                </Form.Group>
                            </Col>

                            <Col xs={12} md>
                                <Form.Group className="mb-3" controlId="formBasicPostgradeUniversity">
                                    <Form.Label className={styles.label_input}>Universidad postgrado</Form.Label>
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Ingrese universidad de prostgrado"
                                    {...register("postgrade_university", {
                                        minLength: {
                                            value: 2,
                                            message: "Nombre de universidad no válido" 
                                        }
                                    })} />
                                    { errors.postgrade_university && <p className={styles.error_message}>
                                        { errors.postgrade_university.message }</p> }
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
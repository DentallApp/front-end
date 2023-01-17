import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Modal, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useWindowWidth } from '@react-hook/window-size';
import moment from 'moment';
import Select from 'react-select';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { 
    formatEmail,
    formatSecurePassword, 
    formatIdentityDocument, 
    formatNames,  
    formatPhone } from 'utils/formatUtils';   
import { getLocalUser } from 'services/UserService';
import { getRoles } from 'services/RoleService';
import { getOffices } from 'services/OfficeService'; 
import { getGeneralTreatmentName } from 'services/GeneralTreatments'; 
import ROLES from 'constants/Roles';
import STATUS from 'constants/Status';
import styles from './FormModal.module.css';

const FormModal = ({show, handleClose, genders, userSelect = null, saveUser}) => {
    
    const stylesSelect = {
        multiValue: (base, state) => {
          return state.data.isFixed  && userSelect !== null ? { ...base, backgroundColor: "#002855" } : base;
        },
        multiValueLabel: (base, state) => {
          return state.data.isFixed && userSelect !== null
            ? { ...base, fontWeight: "bold", color: "white", paddingRight: 6 }
            : base;
        },
        multiValueRemove: (base, state) => {
          return state.data.isFixed && userSelect !== null ? { ...base, display: "none" } : base;
        }
    };

    const user = getLocalUser();
    const [passwordShow, setPasswordShow] = useState(false); // Estado para la acción de mostrar contraseña
    const [office, setOffice] = useState(null); // Estado para los consultorios
    const [roles, setRoles] = useState(null); // Estado para los roles
    const [services, setServices] = useState(null); // Estado para los servicios
    const [type, setType] = useState(userSelect === null ? 'create' : 'edit'); // Estado para tipo de modal
    const [status, setStatus] = useState(null);
    const [changePassword, setChangePassword] = useState(false);
    const onlyWidth = useWindowWidth(); // Se obtiene ancho y altura de pantalla para colocar el modal

    const { register, handleSubmit, reset, setValue, watch, setError, formState: {errors} } = useForm({
        defaultValues: {
            employeeId: `${ userSelect !== null ? userSelect.employeeId : ""}`,
            names: `${ userSelect !== null ? userSelect.names : ""}`,
            lastNames: `${ userSelect !== null ? userSelect.lastNames : ""}`,
            cellPhone: `${ userSelect !== null ? userSelect.cellPhone : ""}`,
            document: `${ userSelect !== null ? userSelect.document : ""}`,
            email: `${ userSelect !== null ? userSelect.email : ""}`,
            password: '',
            dateBirth: `${ userSelect !== null ? moment(userSelect.dateBirth).format('yyyy-MM-DD') : ""}`,
            genderId: `${ userSelect !== null ? userSelect.genderId : ""}`,
            officeId: `${ userSelect !== null ? userSelect.officeId : ""}`,
            officeName: `${ userSelect !== null ? userSelect.officeName : ""}`,
            isDentist: false,
            statusId: `${ userSelect !== null ? (userSelect.isDeleted === false ? STATUS[0].id : STATUS[1].id) : ""}`,
            pregradeUniversity: `${ userSelect !== null ? (userSelect.pregradeUniversity !== null ? userSelect.pregradeUniversity : "") : ""}`,
            postgradeUniversity: `${ userSelect !== null ? (userSelect.postgradeUniversity !== null ? userSelect.postgradeUniversity : "") : ""}`,
        }
    });

    const selectValue = watch("officeId");
    const selectStatusValue = watch("statusId");
    const passwordValue = watch("password");
    const isDentistValue = watch("isDentist");
    const specialtiesValue = watch("specialties");

    useEffect(() => {

        getRoles(user.roles.includes(ROLES.SUPERADMIN)).then(response => {
            if(type === 'edit') {
                if(user.roles.includes(ROLES.SUPERADMIN) && userSelect.employeeId === user.employeeId) {
                    const rolesForSuperAdmin = response.data.filter(role => 
                        (role.name !== ROLES.SUPERADMIN && role.name !== ROLES.ADMIN) ) 
                        setRoles(rolesForSuperAdmin);   
                }
                else {
                    setRoles(response.data);
                }
            }
            else {
                register("officeId", { required: "Consultorio requerido" });
                setRoles(response.data);
            }
        })
        .catch(error => error);    

        getOffices().then(response => {
            setOffice(response.data);
            if(type === 'create') setValue("officeId", response.data[0].id, true);
        })
            .catch(error => error);    

        setStatus(STATUS);
        

        register("officeId", { required: "Consultorio requerido" });
        register("roles", { required: "Rol es requerido" });
        register("statusId", { required: "Estado es requerido" });
        register("specialties");
        
        if(userSelect !== null) {
            setValue("officeId", userSelect.officeId, true);
            setValue("roles", userSelect.roles, true);
            setValue("statusId", userSelect.isDeleted === false ? STATUS[0].id : STATUS[1].id, true);
            setType('edit');

            const dentistRole = userSelect.roles.filter(role => role.name === ROLES.DENTIST);
            
            if(dentistRole.length > 0) {
                loadDentalServices();
                setValue("isDentist", true, true);
                setValue("specialties", userSelect.specialties, true);
            }    

            register("password", {
                pattern: {
                    value: formatSecurePassword,
                    message: "La contraseña debe de contener: " +
                            "Mínimo 5 caracteres, una letra mayúscula, una minúscula y un número"
                },
                minLength: {
                    value: 5,
                    message: "La contraseña debe de tener mínimo 5 carácteres"
                }
            })
        }
        else {
            setValue("statusId", STATUS[0].id, true);
            register("password", {
                required: "Contraseña es requerida",
                pattern: {
                    value: formatSecurePassword,
                    message: "La contraseña debe de contener: " +
                            "Mínimo 5 caracteres, una letra mayúscula, una minúscula y un número"
                },
                minLength: {
                    value: 5,
                    message: "La contraseña debe de tener mínimo 5 carácteres"
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        setValue("officeId", e.target.value, true);
        setValue("officeName", e.target.options[e.target.selectedIndex].text, true);
    }    

    const handleSelectRole = (e, option) => {
        switch (option.action) {
            case 'remove-value':
            case 'pop-value':
              if (option.removedValue.isFixed) {
                e.push(option.removedValue);
              }
              break;
            case 'clear':
                e = option.removedValues.filter(role => role.isFixed);
              break;
            default: break;  
        }

        setValue("roles", e.map(role => {return {
            id: parseInt(role.value),
            name: role.label
        }} ), true);
        showDentalServices(e, option);
    }  
    const handleStatusChange = (e) => setValue("statusId", e.target.value, true);
    
    const handleCheck = (e) => {
        setChangePassword(e.target.checked);

        if(e.target.checked === false) {
            setPasswordShow(false);
            setValue("password", '', true);
        }    
    }
    
    const handleChangePassword = (e) => setValue("password", e.target.value, true);

    const handleSelectServices = (e) => setValue("specialties", e.map(service => {
        return {
            id: parseInt(service.value),
            name: service.label
        }    
    }), true);

    // Esta función se encarga de cargar los servicios dentales siempre y cuando
    // el usuario tenga rol de odontólogo
    const showDentalServices = (roles, option) => {
        let isDentist = roles.filter(role => role.label === ROLES.DENTIST);
        
        if((option.action === 'remove-value' || option.action === 'pop-value') && isDentist.length <= 0) {
            setValue('isDentist', false, true); 
            return;
        }

        if(isDentist.length > 0) {
            services === null && loadDentalServices();
            setValue('isDentist', true, true);    
        }
        else {
            setValue('specialties', null, true);
            setValue('isDentist', false, true);
        }
    }
    
    const loadDentalServices = () => {
        getGeneralTreatmentName()
            .then(res => setServices(res.data))
            .catch(err => err);
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
                <Modal.Title>{ userSelect === null ? 'Crear Usuario' : 'Editar información' }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form 
                className={styles.container_form} 
                onSubmit={handleSubmit((data) => saveUser(data, reset, type, setError))}>
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
                        </Row>

                        <Row>
                            <Col lg={12} md={12}>
                                <Form.Group className={`${type !== 'edit' && 'mb-3'}`} controlId="formBasicPassword">
                                    <Form.Label className={styles.label_input}>* Contraseña</Form.Label>
                                    <InputGroup className="mb-1">
                                        <Form.Control 
                                        className={`${styles.form_control} ${styles.form_control_password}`} 
                                        disabled={
                                            userSelect === null ? false : (
                                                changePassword === true ? false : true
                                            )
                                        }
                                        value={passwordValue}
                                        onChange={handleChangePassword}
                                        type={passwordShow ? "text" : "password"}
                                        placeholder="Ingrese contraseña" />
                                        <Button 
                                        className={styles.button_visible}
                                        disabled={
                                            userSelect === null ? false : (
                                                changePassword === true ? false : true
                                            )
                                        }
                                        onClick={() => setPasswordShow(!passwordShow)}>
                                            {passwordShow ? <MdVisibilityOff /> : <MdVisibility />}
                                        </Button>   
                                    </InputGroup>
                                    { errors.password && <p className={styles.error_message}>{ errors.password.message }</p> } 
                                </Form.Group> 
                            </Col>
                            {
                                type === 'edit' && (
                                    <Col lg={12} md>
                                        <Form.Group className="mb-4" controlId="formBasicChangePassword">
                                            <Form.Check
                                            type='checkbox'
                                            label='Cambiar contraseña'
                                            onChange={handleCheck}
                                            />
                                        </Form.Group>
                                    </Col>
                                )
                            }
                        </Row>

                        { 
                            user.roles.includes(ROLES.SUPERADMIN) && ( 
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
                                                    key={data.id} 
                                                    value={data.id}>
                                                        {data.name}
                                                    </option>
                                                ))
                                            ) }
                                            </Form.Select>
                                            { errors.officeId && <p className={styles.error_message}>{ errors.officeId.message }</p> }
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )
                        }    

                        <Row>
                            <Col lg={12} md>
                                <Form.Group className="mb-3" controlId="formBasicRole">
                                    <Form.Label className={styles.label_input}>* Roles</Form.Label><br />
                                    <Select
                                    placeholder="Seleccione"
                                    defaultValue={
                                        userSelect !== null && userSelect.roles.map(r => {
                                            return {
                                                value:r.id, 
                                                label: r.name, 
                                                isFixed: userSelect !== null ? (user.roles.includes(ROLES.SUPERADMIN) && 
                                                    userSelect.employeeId === user.employeeId && 
                                                    r.name === ROLES.SUPERADMIN ? true : false): false
                                            }
                                        })
                                    }
                                    isMulti
                                    name="colors"
                                    options={ roles && roles.map(role => {
                                        return {
                                            value: role.id, 
                                            label: role.name, 
                                            isFixed: userSelect !== null ? (user.roles.includes(ROLES.SUPERADMIN) && 
                                                    userSelect.employeeId === user.employeeId && 
                                                    role.name === ROLES.SUPERADMIN ? true : false) : false
                                        }
                                    })}
                                    onChange={handleSelectRole}
                                    isClearable={ (roles && userSelect !== null) ? !userSelect.roles.some(role => role.name === ROLES.SUPERADMIN) : null}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    styles={stylesSelect}
                                    />
                                    { errors.roles && <p className={styles.error_message}>{ errors.roles.message }</p> }
                                </Form.Group>
                            </Col>
                        </Row>

                        {
                            isDentistValue === true && services !== null && (
                                services.length > 0 && (
                                    <Row>
                                        <Col lg={12} md>
                                            <Form.Group className="mb-3" controlId="formBasicServices">
                                                <Form.Label className={styles.label_input}>Servicios Dentales</Form.Label><br />
                                                <Select
                                                placeholder="Seleccione"
                                                defaultValue={
                                                    userSelect !== null && userSelect.specialties?.map(s => {
                                                        return {
                                                            value: s.id, 
                                                            label: s.name
                                                        }
                                                    })
                                                }
                                                isMulti
                                                name="services"
                                                options={ 
                                                    services.map(service => {
                                                    return {
                                                        value: service.id, 
                                                        label: service.name
                                                    }
                                                })}
                                                onChange={handleSelectServices}
                                                isClearable={false}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                styles={stylesSelect}
                                                />
                                                {
                                                    (specialtiesValue === null || specialtiesValue === undefined || 
                                                    specialtiesValue?.length === 0) && (
                                                        <p className={styles.text_warning}>
                                                            Si no selecciona ninguna opción, 
                                                            el sistema asumirá que el odontólogo es 
                                                            especialista en todos los servicios
                                                        </p>
                                                    )
                                                }
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                )
                            )
                        }

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
                                            disabled={
                                                user.roles.includes(ROLES.SUPERADMIN) && userSelect.employeeId === user.employeeId ?
                                                true: false
                                            }
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
                       
                        <Row>
                            <Col lg={12} md>
                                <Form.Group className="mb-3" controlId="formBasicPregradeUniversity">
                                    <Form.Label className={styles.label_input}>Universidad pregrado</Form.Label>
                                    <Form.Control 
                                    placeholder="Ingrese universidad de pregrado"
                                    {...register("pregradeUniversity", {
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
                                    {...register("postgradeUniversity", {
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
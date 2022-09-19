import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { AlertMessage, ModalLoading } from 'components';
import { trimSpaces, capitalizeFirstLetter } from 'utils/stringUtils';
import { 
    formatEmail, 
    formatIdentityDocument, 
    formatNames, 
    formatPhone,
    formatSecurePassword } from 'utils/formatUtils';
import { verifyIdentityDocument } from 'utils/validationIdentityDocument'; 
import { UNEXPECTED_ERROR } from 'constants/InformationMessage';  
import { registerBasicUser } from 'services/UserService';
import { getGenders } from 'services/GenderService';
import styles from 'pages/Public/LoginPage/components/FormLogin/FormLogin.module.css';

const RegistrationForm = () => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(null);
    const { register, handleSubmit, reset, setError, formState: {errors} } = useForm();
    const [genders, setGenders] = useState(null);
    const [alert, setAlert] = useState(null);
    const [passwordShow, setPasswordShow] = useState(false); // Estado para la acción de mostrar contraseña

    useEffect(() => {
        getGenders()
            .then(response => setGenders(response.data))
            .catch(error => error);
    }, []);

    const create = async(data) => {
        const result = await registerBasicUser(data);
        setAlert(result);
        setIsLoading({success: result.success});

        if(result.success === true) reset();

        return result;
    }
    
    const handleErrors = (result) => {
        if(result.success === undefined && (result.status === 0 || result.status === 400 || 
            result.status === 404 || result.response.status === 405 ||
            result.status === 500)) {
            setAlert({success: false, message: UNEXPECTED_ERROR});
            setIsLoading({success: false});
        }
    }

    const registerUser = async (data) => {
        const verifyDocument = verifyIdentityDocument(data.document);

        if(verifyDocument === false) {
            setError("document", {
                type: 'custom',
                message: 'Cedula de identidad no válida'
            });
            return;
        }

        setIsLoading({success: undefined});

        // Se elimina espacios innecesarios
        const sanitizedName = trimSpaces(data.names);
        const sanitizedLastName = trimSpaces(data.lastNames);

        // Se convierte a mayúscula la primer letra de cada palabra
        data.names = capitalizeFirstLetter(sanitizedName);
        data.lastNames = capitalizeFirstLetter(sanitizedLastName);
        data.genderId = parseInt(data.genderId);

        const result = await create(data);
        handleErrors(result);
    }

    return(
        <>
            { isLoading ? (isLoading.success === undefined ? <ModalLoading show={true} /> : "") : ""}
            <Form className={styles.container_form} onSubmit={handleSubmit(registerUser)}>
                <h2>Registro</h2>
                <div className="underline mx-auto"></div>
                { 
                    alert && 
                    <AlertMessage 
                    type={ alert.success === false ? 'danger' : 'success' }
                    message={ alert.success === false ? alert.message : 
                    'Usuario registrado exitosamente. Acabamos de enviarte un correo para validar tu cuenta' }
                    setError= { setAlert }  /> 
                }
                <Container>
                    <Row>
                        <Col xs={12} md>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label className={styles.label_input}>Nombre</Form.Label>
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
                                <Form.Label className={styles.label_input}>Apellidos</Form.Label>
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
                                <Form.Label className={styles.label_input}>Teléfono</Form.Label>
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
                                <Form.Label className={styles.label_input}>Cedula</Form.Label>
                                <Form.Control 
                                type="number" 
                                placeholder="Ingrese número de cedula"
                                {...register("document", {
                                    required: "Número de cédula requerido",
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
                                {...register("userName", { 
                                    required: 'Correo electrónico obligatorio',
                                    pattern: {
                                        value: formatEmail,
                                        message: "Correo electrónico no válido"
                                    } 
                                })} />
                                { errors.userName && <p className={styles.error_message}>{ errors.userName.message }</p> }  
                            </Form.Group>
                        </Col>

                        <Col xs={12} md>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label className={styles.label_input}>* Contraseña</Form.Label>
                                <InputGroup className="mb-1">
                                    <Form.Control 
                                    type={passwordShow ? "text" : "password"} 
                                    {...register("password", { 
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
                                    })}
                                    placeholder="Ingrese contraseña" />
                                    <Button 
                                    style={
                                        {
                                            'borderRadius': '0px', 
                                            'backgroundColor': 'transparent', 
                                            'color': '#000',
                                            'borderColor': '#ced4da'
                                        }
                                    }
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
                                <Form.Label className={styles.label_input}>Género</Form.Label>
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
                                <Form.Label className={styles.label_input}>Fecha de nacimiento</Form.Label>
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
                </Container>
                <div className={styles.container_button}>
                    <Button 
                    className={styles.button_sign_in} 
                    type="submit">
                        Registrar
                    </Button>
                    <Button className={styles.button_back} type="button" onClick={() => navigate("/")}>
                        <FaArrowCircleLeft /> Regresar
                    </Button>
                </div>
                <hr style={{"marginTop": "30px"}}/>
                <p className={styles.text}>
                    ¿Tienes cuenta?   
                    <Link className={styles.register} style={{"marginLeft": "5px"}} to="/login">
                        Inicia sesión
                    </Link>
                </p>
            </Form>
        </>
    );
}

export default RegistrationForm;
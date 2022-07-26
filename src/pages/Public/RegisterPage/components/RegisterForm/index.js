import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { AlertMessage } from '../../../../../components';
import { trimSpaces, capitalizeFirstLetter } from '../../../../../utils/stringUtils';
import { 
    formatEmail, 
    formatIdentityDocument, 
    formatNames, 
    formatPassword, 
    formatPhone } from '../../../../../utils/formatUtils';
import { registerBasicUser } from '../../../../../services/UserService';
import { getGenders } from '../../../../../services/GenderService';
import styles from '../../../LoginPage/components/FormLogin/FormLogin.module.css';

const RegistrationForm = () => {

    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: {errors} } = useForm();
    const [genders, setGenders] = useState(null);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        getGenders()
            .then(response => setGenders(response.data))
            .catch(error => console.error(error));
    }, []);

    const registerUser = async (data) => {
        // Se elimina espacios innecesarios
        const sanitizedName = trimSpaces(data.names);
        const sanitizedLastName = trimSpaces(data.lastNames);

        // Se convierte a mayúscula la primer letra de cada palabra
        data.names = capitalizeFirstLetter(sanitizedName);
        data.lastNames = capitalizeFirstLetter(sanitizedLastName);
        data.genderId = parseInt(data.genderId)

        const result = await registerBasicUser(data);
        setAlert(result);

        if(result.success === true) reset();
    }

    return(
        <Form className={styles.container_form} onSubmit={handleSubmit(registerUser)}>
            <h2>Registro</h2>
            <div className="underline mx-auto"></div>
            { 
                alert && 
                <AlertMessage 
                type={ alert.success === false ? 'danger' : 'success' }
                message={ alert.message }
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
                            <Form.Label className={styles.label_input}>Contraseña</Form.Label>
                            <Form.Control 
                            type="password" 
                            placeholder="Ingrese contraseña"
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
                            })} />
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
                            {...register("dateBirth", {
                                required: "Fecha de nacimiento requerida"
                            })} />
                            { errors.dateBirth && <p className={styles.error_message}>{ errors.dateBirth.message }</p> }
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
            <div className={styles.container_button}>
                <Button className={styles.button_sign_in} type="submit">
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
    );
}

export default RegistrationForm;
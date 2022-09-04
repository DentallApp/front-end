import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { BsFillEnvelopeFill, BsFillKeyFill } from "react-icons/bs";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useForm } from 'react-hook-form';
import { AlertMessage, ModalLoading } from 'components';
import { formatEmail, formatPassword } from 'utils/formatUtils';
import { UNEXPECTED_ERROR } from 'constants/InformationMessage';
import { login } from 'services/AuthService';
import styles from './FormLogin.module.css'; 

const FormLogin = () => {
    const [passwordShow, setPasswordShow] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: {errors} } = useForm({
        defaultValues: {
            userName: "",
            password: ""
        }
    });

    const handleErrors = (result) => {
        if(result.success === undefined && (result.status === 0 ||result.status === 400 || result.status === 404 
            || result.status === 405 ||
            result.status === 500)) {
            setError({success: false, message: UNEXPECTED_ERROR});
            setIsLoading({success: false});
        }
    }

    const handleLogin = async (data) => {
        setIsLoading({success: undefined});
        const result = await login(data);
        setError(result);
        setIsLoading({success: result.success});

        if(result.success === true) navigate("/inicio");
        
        handleErrors(result);
    }

    return (
        <>
            { isLoading ? (isLoading.success === undefined ? <ModalLoading show={true} /> : <ModalLoading show={false} />) : ""}
            <Form className={styles.container_form} onSubmit={handleSubmit(handleLogin)}>
                <h2>Login</h2>
                <div className="underline mx-auto"></div>
                { 
                    (error && error.success === false) && 
                    <AlertMessage 
                    type={ error.success === false ? 'danger' : 'success' }
                    message={ error.message }
                    setError= { setError }  /> }
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className={styles.label_input}>Correo</Form.Label>
                    <InputGroup className="mb-1">
                        <InputGroup.Text className={styles.input_group_text}><BsFillEnvelopeFill /></InputGroup.Text>
                        <Form.Control 
                        className={styles.form_control} 
                        type="email" 
                        {...register("userName", { 
                            required: 'Correo electrónico requerido',
                            pattern: {
                                value: formatEmail,
                                message: "Correo electrónico no válido"
                            } 
                        })}
                        placeholder="Ingrese correo electrónico" />   
                    </InputGroup>
                    { errors.userName && <p className={styles.error_message}>{ errors.userName.message }</p> } 
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className={styles.label_input}>Contraseña</Form.Label>
                    <InputGroup className="mb-1">
                        <InputGroup.Text className={styles.input_group_text}><BsFillKeyFill /></InputGroup.Text>
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
            
                <p className={`${styles.forgot_password} ${styles.text}`}>
                    <Link className={styles.register} to="/recuperar-contrasena">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </p>

                <div className={styles.container_button}>
                    <Button className={styles.button_sign_in} type="submit">
                        Iniciar
                    </Button>
                    <Button className={styles.button_back} type="button" onClick={() => navigate("/")}>
                        <FaArrowCircleLeft /> Regresar
                    </Button>
                </div>
                <hr style={{"marginTop": "30px"}}/>
                <p className={styles.text}>
                    ¿No tienes cuenta? 
                    <Link className={styles.register} style={{"marginLeft": "5px"}} to="/registro">
                        Registrate
                    </Link>
                </p>
            </Form>
        </>
    );
}

export default FormLogin;
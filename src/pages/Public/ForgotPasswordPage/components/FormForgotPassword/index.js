import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { BsFillEnvelopeFill } from "react-icons/bs";
import { useForm } from 'react-hook-form';
import { formatEmail } from 'utils/formatUtils';
import { sendUserEmail } from 'services/PasswordResetService';
import { AlertMessage, ModalLoading } from 'components';
import { UNEXPECTED_ERROR } from 'constants/InformationMessage';
import styles from 'pages/Public/LoginPage/components/FormLogin/FormLogin.module.css';

const FormForgotPassword = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(null);
    const [alert, setAlert] = useState(null);
    const { register, handleSubmit, reset, formState: {errors} } = useForm({
        defaultValues: {
            email: "",
        }
    });

    const handleErrors = (result) => {
        if(result.success === undefined && (result.status === 0 || result.status === 400 || 
            result.status === 404 || result.response.status === 405 ||
            result.status === 500)) {
            setAlert({success: false, message: UNEXPECTED_ERROR});
            setIsLoading({success: false});
        }
    }

    const sendData = async(data) => {
        setIsLoading({success: undefined});
        const result = await sendUserEmail(data.email);
        setAlert(result);
        setIsLoading({success: result.success});
        reset();

        handleErrors(result);
    }

    return (
        <>
            { isLoading ? (isLoading.success === undefined ? <ModalLoading show={true} /> : <ModalLoading show={false} />) : null}
            <Form className={`${styles.container_form} ${styles.container_form_center}`} onSubmit={handleSubmit(sendData)}>
                <h2>Recuperar contraseña</h2>
                <div className="underline mx-auto"></div>
                { 
                    alert && 
                    <AlertMessage 
                    type={ alert.success === false ? 'danger' : 'success' }
                    message={ alert.success === false ? alert.message : 'Revise su correo para restablecer la contraseña' }
                    setError= { setAlert }  /> 
                }
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className={styles.label_input}>Correo</Form.Label>
                    <InputGroup className="mb-3">
                        <InputGroup.Text className={styles.input_group_text}><BsFillEnvelopeFill /></InputGroup.Text>
                        <Form.Control 
                        className={styles.form_control} 
                        type="email" 
                        {...register("email", { 
                            required: 'Correo electrónico requerido',
                            pattern: {
                                value: formatEmail,
                                message: "Correo electrónico no válido"
                            } 
                        })}
                        placeholder="Ingrese correo electrónico" />   
                    </InputGroup>
                    { errors.email && <p className={styles.error_message}>{ errors.email.message }</p> } 
                </Form.Group>
                
                <p className={`${styles.forgot_password} ${styles.text}`}>
                    ¿Ya tienes cuenta?
                    <Link className={styles.register} style={{"marginLeft": "5px"}} to="/login">
                        Inicia sesión
                    </Link>
                </p>

                <div className={styles.container_button}>
                    <Button className={styles.button_sign_in} type="submit">
                        Recuperar
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

export default FormForgotPassword;
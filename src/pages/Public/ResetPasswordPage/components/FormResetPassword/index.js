import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { BsFillKeyFill } from "react-icons/bs";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useForm } from 'react-hook-form';
import { formatSecurePassword } from 'utils/formatUtils';
import { resetPassword } from 'services/PasswordResetService';
import { AlertMessage, ModalLoading } from 'components';
import { UNEXPECTED_ERROR } from 'constants/InformationMessage';
import styles from 'pages/Public/LoginPage/components/FormLogin/FormLogin.module.css';

const FormResetPassword = () => {
    // Estado para el botón de mostrar contraseña
    const [passwordShow, setPasswordShow] = useState(false);
    // Estado para el botón de mostrar confirmar contraseña 
    const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);

    const [alert, setAlert] = useState(null);
    const [isValid, setIsValid] = useState(false);
    const [searchParams] = useSearchParams();
    const { register, handleSubmit, setError, reset, formState: {errors} } = useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(null);

    const handleErrors = (result) => {
        if(result.success === undefined && (result.status === 0 || result.status === 400 || 
            result.status === 404 || result.response.status === 405 ||
            result.status === 500)) {
            setAlert({success: false, message: UNEXPECTED_ERROR});
            setIsLoading({success: false});
        }
    }

    const changePassword = async(data) => {
        
        const verification = verifyPassword(data.newPassword, data.confirmPassword);
        
        if(!verification) {
            // Se crea un nuevo error en react hook form
            setError("confirmPassword", {
                type: 'custom',
                message: "Las contraseñas deben de ser iguales"
            });
            return;
        }
        setIsLoading({success: undefined});
        const token = searchParams.get("token");
        const result = await resetPassword(data.newPassword, token);
        setAlert(result);
        setIsLoading({success: result.success});

        if(result.success === true) {reset(); setIsValid(result.success);}
        
        handleErrors(result);
    }

    // Función que se encarga de verificar si las contraseñas ingresadas son iguales
    const verifyPassword = (newPassword, confirmPassword) => newPassword === confirmPassword ? true : false;
    
    return (
        <>
            { isLoading ? (isLoading.success === undefined ? <ModalLoading show={true} /> : "") : ""}
            <Form className={`${styles.container_form} ${styles.container_form_center}`} onSubmit={handleSubmit(changePassword)}>
                <h2>Resetear contraseña</h2>
                <div className="underline mx-auto"></div>
                { 
                    alert && 
                    <AlertMessage 
                    type={ alert.success === false ? 'danger' : 'success' }
                    message={ alert.message }
                    setError= { setAlert }  /> 
                }
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className={styles.label_input}>Contraseña</Form.Label>
                    <InputGroup className="mb-3">
                        <InputGroup.Text className={styles.input_group_text}><BsFillKeyFill /></InputGroup.Text>
                        <Form.Control 
                        className={`${styles.form_control} ${styles.form_control_password}`} 
                        type={passwordShow ? "text" : "password"} 
                        {...register("newPassword", { 
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
                        className={styles.button_visible}
                        onClick={() => setPasswordShow(!passwordShow)}>
                            {passwordShow ? <MdVisibilityOff /> : <MdVisibility />}
                        </Button>   
                    </InputGroup>
                    { errors.newPassword && <p style={{"maxWidth": "350px"}} className={styles.error_message}>{ errors.newPassword.message }</p> } 
                </Form.Group>

                <Form.Group className="mb-3" controlId="formConfirmPassword">
                    <Form.Label className={styles.label_input}>Confirmar contraseña</Form.Label>
                    <InputGroup className="mb-3">
                        <InputGroup.Text className={styles.input_group_text}><BsFillKeyFill /></InputGroup.Text>
                        <Form.Control 
                        className={`${styles.form_control} ${styles.form_control_password}`} 
                        type={confirmPasswordShow ? "text" : "password"} 
                        {...register("confirmPassword", { 
                            required: "Contraseña es requerida",
                        })}
                        placeholder="Ingrese contraseña" />
                        <Button 
                        className={styles.button_visible}
                        onClick={() => setConfirmPasswordShow(!confirmPasswordShow)}>
                            {confirmPasswordShow ? <MdVisibilityOff /> : <MdVisibility />}
                        </Button>   
                    </InputGroup>
                    { errors.confirmPassword && <p className={styles.error_message}>{ errors.confirmPassword.message }</p> } 
                </Form.Group>
                
                <div className={styles.container_button}>
                    <Button className={styles.button_sign_in} type="submit" 
                    disabled={isValid === false ? false : true }>
                        Confirmar
                    </Button>
                    <Button className={styles.button_back} type="button" 
                    onClick={() => {
                        if(isValid === true) navigate('/login')
                        else navigate("/")
                    }}>
                        <FaArrowCircleLeft /> {isValid === true ? 'Ir al login' : 'Cancelar' }
                    </Button>
                </div>
                <hr style={{"marginTop": "30px"}}/>
                
            </Form>
        </>
    );
}

export default FormResetPassword;
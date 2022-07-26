import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { BsFillKeyFill } from "react-icons/bs";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useForm } from 'react-hook-form';
import { formatPassword } from '../../../../../utils/formatUtils';
import styles from '../../../LoginPage/components/FormLogin/FormLogin.module.css';

const FormResetPassword = () => {
    // Estado para el botón de mostrar contraseña
    const [passwordShow, setPasswordShow] = useState(false);
    // Estado para el botón de mostrar confirmar contraseña 
    const [confirmPasswordShow, setConfirmPasswordShow] = useState(false); 
    const { register, handleSubmit, setError, formState: {errors} } = useForm();
    const navigate = useNavigate();

    const changePassword = (data) => {
        const result = verifyPassword(data.password, data.confirmPassword);
        
        if(!result) {
            // Se crea un nuevo error en react hook form
            setError("confirmPassword", {
                type: 'custom',
                message: "Las contraseñas deben de ser iguales"
            });
        }
    }

    // Función que se encarga de verificar si las contraseñas ingresadas son iguales
    const verifyPassword = (password, confirmPassword) => password === confirmPassword ? true : false;
    
    return (
        <Form className={`${styles.container_form} ${styles.container_form_center}`} onSubmit={handleSubmit(changePassword)}>
            <h2>Resetear contraseña</h2>
            <div className="underline mx-auto"></div>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label className={styles.label_input}>Contraseña</Form.Label>
                <InputGroup className="mb-3">
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
                <Button className={styles.button_sign_in} type="submit">
                    Confirmar
                </Button>
                <Button className={styles.button_back} type="button" onClick={() => navigate("/")}>
                    <FaArrowCircleLeft /> Cancelar
                </Button>
            </div>
            <hr style={{"marginTop": "30px"}}/>
            
        </Form>
    );
}

export default FormResetPassword;
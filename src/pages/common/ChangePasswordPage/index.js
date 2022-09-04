import { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { BsFillKeyFill } from "react-icons/bs";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { ModalLoading, AlertMessage } from 'components';
import { formatSecurePassword } from 'utils/formatUtils';
import { updatePassword } from 'services/UserService';
import { handleErrors } from 'utils/handleErrors';
import styles from './ChangePasswordPage.module.css';

const ChangePasswordPage = () => {
    // Estado para el botón de mostrar contraseña
    const [passwordShow, setPasswordShow] = useState(false);
     // Estado para el botón de mostrar confirmar contraseña 
    const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
    const [isLoading, setIsLoading] = useState(null);
    const [alert, setAlert] = useState(null);

    const { register, handleSubmit, reset, formState: {errors} } = useForm();

    const changePassword = async(data) => {
        setIsLoading({success: undefined});
        const result = await updatePassword(data);
        setAlert(result);
        setIsLoading({success: result.success});

        if(result.success === true) reset();

        handleErrors(result, setAlert, setIsLoading);
    }

    return (
        <>
            { isLoading ? (isLoading.success === undefined ? <ModalLoading show={true} /> : "") : ""}
            <div className={styles.wrapper}>
                <Form className={`${styles.container_form} ${styles.container_form_center}`} onSubmit={handleSubmit(changePassword)}>
                    <h2 className='page_title'>Cambiar contraseña</h2>
                    <div className="underline mx-auto"></div>
                    { 
                        alert && 
                        <AlertMessage 
                        type={ alert.success === false ? 'danger' : 'success' }
                        message={ alert.success === false ? alert.message : 
                        'Contraseña actualizada exitosamente' }
                        setError= { setAlert }  /> 
                    }
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className={styles.label_input}>Contraseña anterior</Form.Label>
                        <InputGroup className="mb-3">
                            <InputGroup.Text className={styles.input_group_text}><BsFillKeyFill /></InputGroup.Text>
                            <Form.Control 
                            className={`${styles.form_control} ${styles.form_control_password}`} 
                            type={passwordShow ? "text" : "password"} 
                            {...register("oldPassword", { 
                                required: "Contraseña es requerida",
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
                        { errors.oldPassword && <p className={styles.error_message}>{ errors.oldPassword.message }</p> } 
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formConfirmPassword">
                        <Form.Label className={styles.label_input}>Nueva contraseña</Form.Label>
                        <InputGroup className="mb-3">
                            <InputGroup.Text className={styles.input_group_text}><BsFillKeyFill /></InputGroup.Text>
                            <Form.Control 
                            className={`${styles.form_control} ${styles.form_control_password}`} 
                            type={confirmPasswordShow ? "text" : "password"} 
                            {...register("newPassword", { 
                                required: "Contraseña es requerida",
                                pattern: {
                                    value: formatSecurePassword,
                                    message: "La contraseña debe de contener: " +
                                    "Mínimo 5 caracteres, una letra mayúscula, una minúscula y un número"
                                },
                            })}
                            placeholder="Ingrese contraseña" />
                            <Button 
                            className={styles.button_visible}
                            onClick={() => setConfirmPasswordShow(!confirmPasswordShow)}>
                                {confirmPasswordShow ? <MdVisibilityOff /> : <MdVisibility />}
                            </Button>   
                        </InputGroup>
                        { errors.newPassword && <p className={styles.error_message}>{ errors.newPassword.message }</p> } 
                    </Form.Group>
                    
                    <div className={styles.container_button}>
                        <Button className={styles.button_sign_in} type="submit">
                            Cambiar
                        </Button>
                    </div>
                    <hr style={{"marginTop": "30px"}}/>
                </Form>
            </div>
        </>
    );
}

export default ChangePasswordPage;
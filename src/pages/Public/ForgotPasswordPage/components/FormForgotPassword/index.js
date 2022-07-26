import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { BsFillEnvelopeFill } from "react-icons/bs";
import { useForm } from 'react-hook-form';
import { formatEmail } from '../../../../../utils/formatUtils';
import styles from '../../../LoginPage/components/FormLogin/FormLogin.module.css';

const FormForgotPassword = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: {errors} } = useForm({
        defaultValues: {
            email: ""
        }
    });

    const login = (data) => {
        console.log(data);
        console.log(data.email);
    }

    return (
        <Form className={`${styles.container_form} ${styles.container_form_center}`} onSubmit={handleSubmit(login)}>
            <h2>Recuperar contraseña</h2>
            <div className="underline mx-auto"></div>
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
    );
}

export default FormForgotPassword;
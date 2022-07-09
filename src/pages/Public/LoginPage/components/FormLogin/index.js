import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { BsFillEnvelopeFill, BsFillKeyFill } from "react-icons/bs";
import styles from './FormLogin.module.css'; 

const FormLogin = () => {
    const navigate = useNavigate();

    return (
        <Form className={styles.container_form}>
            <h2>Login</h2>
            <div className="underline mx-auto"></div>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className={styles.label_input}>Correo</Form.Label>
                <InputGroup className="mb-3">
                    <InputGroup.Text className={styles.input_group_text}><BsFillEnvelopeFill /></InputGroup.Text>
                    <Form.Control className={styles.form_control} type="email" placeholder="Ingrese correo electrónico" />    
                </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label className={styles.label_input}>Contraseña</Form.Label>
                <InputGroup className="mb-3">
                    <InputGroup.Text className={styles.input_group_text}><BsFillKeyFill /></InputGroup.Text>
                    <Form.Control className={styles.form_control} type="password" placeholder="Ingrese contraseña" />   
                </InputGroup>
            </Form.Group>

            <p className={`${styles.forgot_password} ${styles.text}`}>¿Olvidaste tu contraseña?</p>

            <div className={styles.container_button}>
                <Button className={styles.button_sign_in} type="button">
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
    );
}

export default FormLogin;
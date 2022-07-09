import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaArrowCircleLeft } from 'react-icons/fa';
import styles from '../../../LoginPage/components/FormLogin/FormLogin.module.css';

const RegistrationForm = () => {
    const navigate = useNavigate();

    return(
        <Form className={styles.container_form}>
            <h2>Registro</h2>
            <div className="underline mx-auto"></div>
            <Container>
                <Row>
                    <Col xs={12} md>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label className={styles.label_input}>Nombre</Form.Label>
                            <Form.Control placeholder="Ingrese nombre" /> 
                        </Form.Group>
                    </Col>

                    <Col xs={12} md>
                        <Form.Group className="mb-3" controlId="formBasicLastName">
                            <Form.Label className={styles.label_input}>Apellidos</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese apellidos" />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col xs={12} md>
                        <Form.Group className="mb-3" controlId="formBasicPhone">
                            <Form.Label className={styles.label_input}>Teléfono</Form.Label>
                            <Form.Control type="number" placeholder="Ingrese número de celular" /> 
                        </Form.Group>
                    </Col>

                    <Col xs={12} md>
                        <Form.Group className="mb-3" controlId="formBasicId">
                            <Form.Label className={styles.label_input}>Cedula</Form.Label>
                            <Form.Control type="number" placeholder="Ingrese número de cedula" />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col xs={12} md>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label className={styles.label_input}>Correo</Form.Label>
                            <Form.Control type="email" placeholder="Ingrese correo electrónico" /> 
                        </Form.Group>
                    </Col>

                    <Col xs={12} md>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label className={styles.label_input}>Contraseña</Form.Label>
                            <Form.Control type="password" placeholder="Ingrese contraseña" />
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
            <div className={styles.container_button}>
                <Button className={styles.button_sign_in} type="button">
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
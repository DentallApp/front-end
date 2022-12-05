import { useContext } from 'react';
import{ Navbar, Nav, Container, NavDropdown, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa'
import { logo } from 'img';
import GeneralTreamentsContext from 'context/GeneralTreamentsContext';
import styles from './Header.module.css';

const Header = () => {

    const navigate = useNavigate();
    const { getGeneralTreatmentAll } = useContext(GeneralTreamentsContext);
    let generalTreatments = getGeneralTreatmentAll();
    
    return (
        <Navbar sticky='top' className={styles.navigation} bg="light" collapseOnSelect expand="lg" variant="light">
            <Container >
                <Navbar.Brand as={Link} to="/" onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' })} }>
                    <img
                        src={ logo }
                        width="150"
                        height="50"
                        className="d-inline-block align-top"
                        alt="React Bootstrap logo"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link 
                        as={Link} 
                        to="/" 
                        onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' })} }>
                            Inicio
                        </Nav.Link>
                        <Nav.Link 
                        as={Link} 
                        to="/nosotros" 
                        onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' })} }>
                            Nosotros
                        </Nav.Link>
                        <NavDropdown title="Servicios dentales" id="collasible-nav-dropdown">
                            {generalTreatments != null && generalTreatments.map(service => (
                                <NavDropdown.Item 
                                    key={service.id} 
                                    as={Link} 
                                    to={`/servicio/${service.id}`}
                                    onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' })} }>
                                    {service.name}
                                </NavDropdown.Item>
                            ))}
                        </NavDropdown>
                        <Button className={styles.button_appointment} onClick={() => navigate('/login')}> 
                            <FaCalendarAlt /> Agenda tu cita
                        </Button>
                    </Nav>
                    <Form className="d-flex justify-content-center">
                        <Button className={styles.button_navigation_action} onClick={() => navigate('/login')}>
                            Iniciar Sesión
                        </Button>
                        <Button className={styles.button_navigation_action} onClick={() => navigate('/registro')}>
                            Registrarse
                        </Button>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
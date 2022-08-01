import { useContext } from 'react';
import { Link } from 'react-router-dom';
import{ NavDropdown } from 'react-bootstrap';
import SideBarContext from '../../context/SideBarContext';
import styles from './NavBarDashboard.module.css';
import { ImMenu } from "react-icons/im";
import { user } from '../../img';
import { logout } from '../../services/AuthService';

const NavBarDashboard = () => {

    const { handleSidebar, onlyWidth } = useContext(SideBarContext);

    return (
        <header>
            <nav className={styles.navbar}>
                { onlyWidth <= 768 && (
                    <div className={styles.toggle} onClick={() => handleSidebar() }>
                        <ImMenu className={styles.icon} />
                    </div>
                ) }
                <div className={styles.user}>
                    <NavDropdown title={<img src={user} alt="avatar"/>} id="collasible-nav-dropdown">
                        <NavDropdown.Item as={Link} to="/configuracion">Configurar</NavDropdown.Item>
                        <NavDropdown.Item 
                        as={Link} to="/login" onClick={() => {
                        handleSidebar();
                        logout();
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}>Salir</NavDropdown.Item>
                    </NavDropdown> 
                </div>
            </nav>
        </header>
    );
}

export default NavBarDashboard;
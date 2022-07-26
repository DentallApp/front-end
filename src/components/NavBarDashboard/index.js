import { useContext } from 'react';
import { Link } from 'react-router-dom';
import{ NavDropdown } from 'react-bootstrap';
import SideBarContext from '../../context/SideBarContext';
import styles from './NavBarDashboard.module.css';
import { ImMenu } from "react-icons/im";
import { user } from '../../img';

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
                    <img src={user} alt="avatar"/>
                    <NavDropdown title="" id="collasible-nav-dropdown">
                        <NavDropdown.Item as={Link} to="/usuario/configuracion">Configurar</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/login">Salir</NavDropdown.Item>
                    </NavDropdown> 
                </div>
            </nav>
        </header>
    );
}

export default NavBarDashboard;
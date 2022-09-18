import { useContext } from 'react';
import { Link } from 'react-router-dom';
import{ NavDropdown } from 'react-bootstrap';
import { ImMenu } from "react-icons/im";
import SideBarContext from 'context/SideBarContext';
import { logout } from 'services/AuthService';
import  {getLocalUser } from 'services/UserService';
import { user } from 'img';
import styles from './NavBarDashboard.module.css';

const NavBarDashboard = () => {
    const { handleSidebar, onlyWidth } = useContext(SideBarContext);

    return (
        <header>
            <nav className={styles.navbar}>
                { onlyWidth <= 1000 ? (
                    <div className={styles.toggle} onClick={() => handleSidebar() }>
                        <ImMenu className={styles.icon} />
                    </div>
                ):<></> }
                <div className={styles.container_user_info}>
                    <div style={{'width':'100%'}}>
                        <p className={styles.user_name}>
                            {`${getLocalUser().names?.split(' ')[0] ?? ''} ${getLocalUser().lastNames?.split(' ')[0] ?? ''}`}
                        </p>
                        <p className={styles.user_role}>{ `(${getLocalUser().roles[getLocalUser().roles.length - 1]})`}</p>
                    </div>
                    <div className={styles.user}>
                        <NavDropdown 
                        title={<img src={user} alt="avatar"/>} 
                        id="collasible-nav-dropdown">
                            <NavDropdown.Item 
                                as={Link} 
                                to="/perfil" onClick={() => handleSidebar()}>
                                    Perfil
                                </NavDropdown.Item>
                            <NavDropdown.Item 
                            as={Link} to="/login" onClick={() => {
                            handleSidebar();
                            logout();
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}>
                                Salir
                            </NavDropdown.Item>
                        </NavDropdown> 
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default NavBarDashboard;
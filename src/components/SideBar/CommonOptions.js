import { NavLink } from 'react-router-dom';
import { FaUsers } from "react-icons/fa";
import ROLES from '../../constants/Roles';
import { getLocalUser } from '../../services/UserService';
import styles from './SideBar.module.css';

const CommonOptions = () => {

    const user = getLocalUser();

    return (
        <>
            { 
                (user.roles.includes(ROLES.ADMIN) || user.roles.includes(ROLES.SUPERADMIN)) &&  
                <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
                to={'gestion-usuarios'} 
                onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' })} }>
                    <FaUsers className={styles.icon} /> 
                    Usuarios
                </NavLink>
            }
            
        </>
    );
}

export default CommonOptions;
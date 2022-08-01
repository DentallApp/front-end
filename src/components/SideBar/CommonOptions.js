import { NavLink } from 'react-router-dom';
import { IoCalendarNumber } from "react-icons/io5";
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
                to={`gestion-usuarios/${user.roles[0].toLowerCase()}`} 
                onClick={() => {} }>
                    <IoCalendarNumber className={styles.icon} /> 
                    Usuarios
                </NavLink>
            }
            
        </>
    );
}

export default CommonOptions;
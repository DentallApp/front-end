import { NavLink } from 'react-router-dom';
import { FaUsers } from "react-icons/fa";
import { BsCalendarWeekFill } from "react-icons/bs";
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
            
            { 
                (user.roles.includes(ROLES.SECRETARY) || user.roles.includes(ROLES.ADMIN)) &&  
                <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
                to={'gestion-horarios'} 
                onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' })} }>
                    <BsCalendarWeekFill className={styles.icon} /> 
                    Horarios
                </NavLink>
            }

        </>
    );
}

export default CommonOptions;
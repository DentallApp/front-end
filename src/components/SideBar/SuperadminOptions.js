import { NavLink } from 'react-router-dom';
import { TbDental } from "react-icons/tb";
import { RiHealthBookFill } from "react-icons/ri";
import styles from './SideBar.module.css';

const SuperadminOptions = () => {
    return (
        <>
            <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
            to="gestion-servicio" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <TbDental className={styles.icon} /> 
                Servicios
            </NavLink>
            <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
            to="gestion-tratamientos" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <RiHealthBookFill className={styles.icon} /> 
                Tratamientos
            </NavLink>
        </>
    );
}

export default SuperadminOptions;
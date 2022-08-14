import { NavLink } from 'react-router-dom';
import { TbDental } from "react-icons/tb";
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
        </>
    );
}

export default SuperadminOptions;
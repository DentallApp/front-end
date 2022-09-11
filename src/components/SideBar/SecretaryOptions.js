import { NavLink } from 'react-router-dom';
import { IoPersonAddSharp } from "react-icons/io5";
import { BsBookHalf } from 'react-icons/bs';
import styles from './SideBar.module.css';

const SecretaryOptions = () => {
    return (
        <>
            <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
            to="registrar-paciente" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'}) }>
                <IoPersonAddSharp className={styles.icon} />
                Registro paciente
            </NavLink>

            <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
            to="agendar-cita" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'}) }>
                <BsBookHalf className={styles.icon} />
                Agendar cita
            </NavLink>
        </>
    );
}

export default SecretaryOptions;
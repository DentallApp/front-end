import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { IoPersonAddSharp } from "react-icons/io5";
import { BsBookHalf } from 'react-icons/bs';
import SideBarContext from 'context/SideBarContext';
import styles from './SideBar.module.css';

const SecretaryOptions = () => {

    const { handleSidebar } = useContext(SideBarContext);

    return (
        <>
            <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
            to="registrar-paciente" 
            onClick={() => {
                handleSidebar(false);
                window.scrollTo({ top: 0, behavior: 'smooth'}) 
            }}>
                <IoPersonAddSharp className={styles.icon} />
                Registro paciente
            </NavLink>

            <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
            to="agendar-cita" 
            onClick={() => {
                handleSidebar(false);
                window.scrollTo({ top: 0, behavior: 'smooth'}) 
            }}>
                <BsBookHalf className={styles.icon} />
                Agendar cita
            </NavLink>
        </>
    );
}

export default SecretaryOptions;
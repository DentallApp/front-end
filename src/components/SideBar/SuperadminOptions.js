import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { TbDental } from "react-icons/tb";
import { RiHealthBookFill } from "react-icons/ri";
import SideBarContext from 'context/SideBarContext';
import styles from './SideBar.module.css';

const SuperadminOptions = () => {
    
    const { handleSidebar } = useContext(SideBarContext);
    
    return (
        <>
            <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
            to="gestion-servicio" 
            onClick={() => {
                handleSidebar(false);
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }}>
                <TbDental className={styles.icon} /> 
                Servicios
            </NavLink>
            <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
            to="gestion-tratamientos" 
            onClick={() => {
                handleSidebar(false);
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }}>
                <RiHealthBookFill className={styles.icon} /> 
                Tratamientos
            </NavLink>
        </>
    );
}

export default SuperadminOptions;
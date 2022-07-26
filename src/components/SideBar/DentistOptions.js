import { NavLink } from 'react-router-dom';
import { IoCalendarNumber } from "react-icons/io5";
import styles from './SideBar.module.css';

const DentistOptions = () => {
    return (
        <>
            <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
            to="calendario-de-citas" 
            onClick={() => window.scrollTo(0, document.body.scrollHeight) }>
                <IoCalendarNumber className={styles.icon} /> 
                Citas
            </NavLink>
        </>
    );
}

export default DentistOptions;
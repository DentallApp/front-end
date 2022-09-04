import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUsers } from "react-icons/fa";
import { AiOutlineCaretDown,AiOutlineCaretUp } from "react-icons/ai";
import { FaTasks } from 'react-icons/fa';
import { BsFillCalendar2WeekFill } from "react-icons/bs";
import { ImOffice } from "react-icons/im";
import { BsCalendarWeekFill } from "react-icons/bs";
import ROLES from 'constants/Roles';
import { getLocalUser } from 'services/UserService';
import styles from './SideBar.module.css';

const CommonOptions = () => {
    const [submenuShow, setSubmenuShow] = useState(false);
    const user = getLocalUser();

    return (
        <>
            { 
                (user.roles.includes(ROLES.ADMIN) || user.roles.includes(ROLES.SUPERADMIN)) &&  
                <>
                    <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
                    to={'gestion-usuarios'} 
                    onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' })} }>
                        <FaUsers className={styles.icon} /> 
                        Usuarios
                    </NavLink>

                    <NavLink className={styles.navlink }
                    to="#"
                    onClick={() => {setSubmenuShow(!submenuShow)} }>
                        <div className={styles.container_submenu}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <ImOffice className={styles.icon} /> 
                                Consultorios
                            </div>
                            { !submenuShow ? 
                                <AiOutlineCaretDown className={styles.icon} /> 
                                : <AiOutlineCaretUp className={styles.icon}/> 
                            } 
                        </div>
                    </NavLink>
                    { submenuShow && (
                        <ul className={styles.submenu}>
                            {
                                (user.roles.includes(ROLES.SUPERADMIN)) && (
                                    <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink }
                                    to="consultorios/gestion"
                                    onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' })} }>
                                        <FaTasks className={styles.icon} />
                                        Gestion
                                    </NavLink>
                                ) 
                            }
                                   
                            <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
                            to="consultorios/horarios"
                            onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' })} }>
                                <BsFillCalendar2WeekFill className={styles.icon} /> 
                                Horarios de atención
                            </NavLink>      
                        </ul>
                    ) }
                </>
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
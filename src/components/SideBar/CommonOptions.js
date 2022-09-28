import { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUsers } from "react-icons/fa";
import { AiOutlineCaretDown,AiOutlineCaretUp } from "react-icons/ai";
import { FaTasks } from 'react-icons/fa';
import { 
    BsFillCalendar2WeekFill, 
    BsCalendarWeekFill, 
    BsFillCalendarWeekFill, 
    BsFillCalendar2XFill,
    BsFillCheckCircleFill
} from "react-icons/bs";
import { FaClipboardList, FaListOl } from "react-icons/fa";
import { ImOffice } from "react-icons/im";
import { IoCalendarNumber } from "react-icons/io5";
import { GoTasklist } from 'react-icons/go';
import ROLES from 'constants/Roles';
import { getLocalUser } from 'services/UserService';
import SideBarContext from 'context/SideBarContext';
import styles from './SideBar.module.css';

const CommonOptions = () => {
    const [submenuShow, setSubmenuShow] = useState(false);
    const [submenuAppointment, setSubmenuAppointment] = useState(false);
    const [submenuReports, setSubmenuReports] = useState(false);
    const { handleSidebar } = useContext(SideBarContext);
    const user = getLocalUser();

    return (
        <>
            {
                (user.roles.includes(ROLES.DENTIST) || user.roles.includes(ROLES.SECRETARY) || 
                user.roles.includes(ROLES.ADMIN) || user.roles.includes(ROLES.SUPERADMIN)) &&
                <>
                    <NavLink className={styles.navlink }
                    to="#"
                    onClick={() => {setSubmenuAppointment(!submenuAppointment)} }>
                        <div className={styles.container_submenu}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <IoCalendarNumber className={styles.icon} /> 
                                Citas
                            </div>
                            { !submenuAppointment ? 
                                <AiOutlineCaretDown className={styles.icon} /> 
                                : <AiOutlineCaretUp className={styles.icon}/> 
                            } 
                        </div>
                    </NavLink>
                    { submenuAppointment && (
                        <ul className={styles.submenu}>
                            <NavLink className={({ isActive }) => isActive ? 
                            `${styles.navlink_active}` : `${styles.navlink}` }
                            to="citas/calendario"
                            onClick={() => {
                                handleSidebar(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}>
                                <BsFillCalendarWeekFill className={styles.icon} />
                                Calendario
                            </NavLink>
                                   
                            <NavLink className={({ isActive }) => isActive ? 
                            `${styles.navlink_active}` : `${styles.navlink}` } 
                            to="citas/cancelacion"
                            onClick={() => {
                                handleSidebar(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}>
                                <BsFillCalendar2XFill className={styles.icon} /> 
                                Cancelar
                            </NavLink>      
                        </ul>
                    ) }
                </>
            }

            { 
                ( user && (user.roles.includes(ROLES.ADMIN) || user.roles.includes(ROLES.SUPERADMIN))) &&  
                <>
                    <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
                    to={'gestion-usuarios'} 
                    onClick={() => {
                        handleSidebar(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}>
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
                                    onClick={() => {
                                        handleSidebar(false);
                                        window.scrollTo({ top: 0, behavior: 'smooth' })
                                    }}>
                                        <FaTasks className={styles.icon} />
                                        Gestion
                                    </NavLink>
                                ) 
                            }
                                   
                            <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
                            to="consultorios/horarios"
                            onClick={() => {
                                handleSidebar(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}>
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
                onClick={() => {
                    handleSidebar(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                }}>
                    <BsCalendarWeekFill className={styles.icon} /> 
                    Horarios
                </NavLink>
            }

            { 
                ( user && (user.roles.includes(ROLES.ADMIN) || user.roles.includes(ROLES.SUPERADMIN))) &&  
                <>
                    <NavLink className={styles.navlink }
                    to="#"
                    onClick={() => {setSubmenuReports(!submenuReports)} }>
                        <div className={styles.container_submenu}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <FaClipboardList className={styles.icon} /> 
                                Reportes
                            </div>
                            { !submenuReports ? 
                                <AiOutlineCaretDown className={styles.icon} /> 
                                : <AiOutlineCaretUp className={styles.icon}/> 
                            } 
                        </div>
                    </NavLink>
                    { submenuReports && (
                        <ul className={styles.submenu}>        
                            <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
                            to="reportes/citas"
                            onClick={() => {
                                handleSidebar(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}>
                                <GoTasklist className={`${styles.icon} ${styles.icon_report}`}/> 
                                Citas asistidas, no asistidas y canceladas
                            </NavLink>

                            <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
                            to="reportes/citas-agendadas"
                            onClick={() => {
                                handleSidebar(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}>
                                <BsFillCheckCircleFill className={styles.icon}/> 
                                Citas agendadas
                            </NavLink>

                            <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
                            to="reportes/ranking-servicios-dentales"
                            onClick={() => {
                                handleSidebar(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}>
                                <FaListOl className={`${styles.icon} ${styles.icon_report}`}/> 
                                Servicios dentales más solicitados
                            </NavLink>         
                        </ul>
                    ) }
                </>
            }

        </>
    );
}

export default CommonOptions;
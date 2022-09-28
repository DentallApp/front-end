import { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AiOutlineCaretDown,AiOutlineCaretUp } from "react-icons/ai";
import { IoCalendarNumber } from "react-icons/io5";
import { BsPersonPlusFill, BsPersonBadgeFill } from "react-icons/bs";
import { MdFavorite } from "react-icons/md";
import { FaThList } from "react-icons/fa";
import { HiCurrencyDollar } from "react-icons/hi";
import SideBarContext from 'context/SideBarContext';
import styles from './SideBar.module.css';

const BasicUserOptions = () => {
    const [submenuShow, setSubmenuShow] = useState(false);
    const { handleSidebar } = useContext(SideBarContext);

    return(
        <>
            <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
            to="agendamiento/chatbot" 
            onClick={() => {
                handleSidebar(false);
                window.scrollTo(0, document.body.scrollHeight)
            }}>
                <IoCalendarNumber className={styles.icon} /> 
                Agendar cita
            </NavLink>
            <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
            to="lista-citas"
            onClick={() => {
                handleSidebar(false);
                window.scrollTo({ top: 0, behavior: 'smooth'})
            }}>
                <FaThList className={styles.icon} /> 
                Historial de citas
            </NavLink>
            <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
            to="gestion-dependientes"
            onClick={() => {
                handleSidebar(false);
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }}>
                <BsPersonPlusFill className={styles.icon} /> 
                Dependientes
            </NavLink>
            <NavLink className={styles.navlink }
            to="#"
            onClick={() => {setSubmenuShow(!submenuShow)} }>
                <div className={styles.container_submenu}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <BsPersonBadgeFill className={styles.icon} /> 
                        Odontólogos
                    </div>
                    { !submenuShow ? 
                        <AiOutlineCaretDown className={styles.icon} /> 
                        : <AiOutlineCaretUp className={styles.icon}/> 
                    } 
                </div>
            </NavLink>
            { submenuShow && (
                <ul className={styles.submenu}>
                    <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink }
                    to="odontologos/lista"
                    onClick={() => {
                        handleSidebar(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}>
                        <FaThList className={styles.icon} />
                        Lista
                    </NavLink>
                    <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
                    to="odontologos/favoritos"
                    onClick={() => {
                        handleSidebar(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}>
                        <MdFavorite className={styles.icon} /> 
                        Favoritos
                    </NavLink>      
                </ul>
            ) }
            <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
            to="cotizacion"
            onClick={() => {
                handleSidebar(false);
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }}>
                <HiCurrencyDollar className={styles.icon} /> 
                Cotizar
            </NavLink>
        </>
    );
}

export default BasicUserOptions;
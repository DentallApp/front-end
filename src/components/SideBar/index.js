import { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AiFillHome } from "react-icons/ai";
import { MdPassword, MdManageAccounts  } from "react-icons/md";
import { ImExit } from "react-icons/im";
import BasicUserOptions from './BasicUserOptions';
import { logo } from 'img';
import { logout } from 'services/AuthService';
import { getLocalUser } from 'services/UserService';
import ROLES from 'constants/Roles';
import SecretaryOptions from './SecretaryOptions';
import SuperadminOptions from './SuperadminOptions';
import SideBarContext from 'context/SideBarContext';
import CurrentUserNameContext from 'context/CurrentUserNameContext'; 
import CommonOptions from './CommonOptions';
import styles from './SideBar.module.css';

const SideBar = () => {

    const { handleSidebar } = useContext(SideBarContext);
    const [userData, setUserData] = useState(getLocalUser());
    const [loading, setLoading] = useState(false);
    const { clearNames } = useContext(CurrentUserNameContext);

    useEffect(() => {
        setUserData(getLocalUser());
        setLoading(true);
    }, []);

    return(
        <>
            {loading === true ? (
                userData ? (
                    <div className={styles.sidebar}>
                        <div className={styles.top}>
                        <img
                        src={ logo }
                        width="150"
                        height="50"
                        className="d-inline-block align-top"
                        alt="React Bootstrap logo"
                        />
                    </div>
                    <hr />
                    <div className={styles.center}>
                        <ul>
                            <NavLink 
                            className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
                            to={'/inicio'}
                            onClick={() => {
                                handleSidebar(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}> 
                                <AiFillHome className={styles.icon} /> 
                                Inicio
                            </NavLink>
    
                            { userData ? (userData.roles.includes(ROLES.BASIC_USER) &&  <BasicUserOptions />) : null }

                            { userData ? (userData.roles.includes(ROLES.SECRETARY) && <SecretaryOptions />) : null }

                            { userData ? (userData.roles.includes(ROLES.SUPERADMIN) && <SuperadminOptions />) : null }

                            { userData && <CommonOptions /> }

                            <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
                            to="cambio-contrasena"
                            onClick={() => {
                                handleSidebar(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}>
                                <MdPassword className={styles.icon} /> 
                                Cambiar contraseña
                            </NavLink>

                            <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
                            to="perfil"
                            onClick={() => {
                                handleSidebar(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}>
                                <MdManageAccounts className={styles.icon} /> 
                                Editar perfil
                            </NavLink>
                        
                            <NavLink className={({ isActive }) => isActive ? styles.navlink_active : styles.navlink } 
                            to="/login"
                            onClick={() => {
                                handleSidebar(false);
                                logout();
                                setUserData(null);
                                clearNames();
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}>
                                <ImExit className={styles.icon} /> 
                                Salir
                            </NavLink>
                        </ul>
                    </div>
                </div>    
            ):(window.location.reload()))
            :(<></>)
        }
        </>    
    );
}

export default SideBar;
import { useNavigate } from 'react-router-dom';
import{ Button } from 'react-bootstrap';
import { IoArrowBackCircle } from "react-icons/io5";
import styles from '../NotFoundPage/NotFoundPage.module.css';
import ROLES from 'constants/Roles';
import { getLocalUser } from 'services/UserService';

const SessionExpiredPage = () => {

    const navigate = useNavigate();
    const user = getLocalUser();

    return(
        <section className={styles.container_error}>
            <div className={styles.container_text}>
                <h2>Error 401</h2>
                <h2>No está autorizado</h2>
            </div>
            <Button 
            className={styles.button_back}
            onClick={() => { 
                user ? ( user.accessToken ? navigate(user.roles[0].includes(ROLES.BASIC_USER) ? '/inicio' : 
                `/inicio-${user.roles[0].toLowerCase()}`) : navigate("/login") ) : navigate("/login") 
            }}>
                <IoArrowBackCircle className={styles.icon} /> Regresar
            </Button>
        </section>
    );
}

export default SessionExpiredPage;
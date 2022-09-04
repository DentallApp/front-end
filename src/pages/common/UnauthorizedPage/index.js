import { useNavigate } from 'react-router-dom';
import{ Button } from 'react-bootstrap';
import { IoArrowBackCircle } from "react-icons/io5";
import styles from '../NotFoundPage/NotFoundPage.module.css';
import { getLocalUser } from 'services/UserService';
import { getLocalAccessToken } from 'services/TokenService';

const UnathorizedPage = () => {

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
                user ? ( getLocalAccessToken() ? navigate("/inicio") : navigate("/") ) : navigate("/") 
            }}>
                <IoArrowBackCircle className={styles.icon} /> Regresar
            </Button>
        </section>
    );
}

export default UnathorizedPage;
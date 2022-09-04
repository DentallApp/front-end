import { useNavigate } from 'react-router-dom';
import{ Button } from 'react-bootstrap';
import { IoArrowBackCircle } from "react-icons/io5";
import { getLocalUser } from 'services/UserService';
import { getLocalAccessToken } from 'services/TokenService';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {

    const navigate = useNavigate();
    const user = getLocalUser();

    return(
        <section className={styles.container_error}>
            <div className={styles.container_text}>
                <h2>Error 404</h2>
                <h2>Página no encontrada</h2>
            </div>
            <Button 
            className={styles.button_back}
            onClick={() => { 
                user ? ( user && getLocalAccessToken() ? navigate("/inicio") : navigate("/") ) : navigate("/") 
            }}>
                <IoArrowBackCircle className={styles.icon} /> Regresar
            </Button>
        </section>
    );
}

export default NotFoundPage;
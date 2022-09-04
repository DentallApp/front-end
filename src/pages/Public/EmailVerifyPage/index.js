import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import{ Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { IoArrowBackCircle } from "react-icons/io5";
import { check } from 'img';
import { emailVerification } from 'services/EmailService';
import styles from './EmailVerifyPage.module.css';

const EmailVerifyPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [validUrl, setValidUrl] = useState(false);
    const [counter, setCounter] = useState(0); // Colocar en entorno de desarrollo
    const [result, setResult] = useState(null);
    
    const token = searchParams.get("token");

    useEffect(() => {
        
        emailVerification(token).then(res => {
            // Colocar el if si está en entorno de desarrollo para 
            // evitar el error al dar el doble renderizado por parte
            // de StrictMode
            if(counter !== 2 && res.success === true) {
                setValidUrl(true);
            }
            // Colocar en entorno de producción
            // setValidUrl(true); 
            setResult(res);
        })
        .catch(err => {
            // Colocar el if si está en entorno de desarrollo para 
            // evitar el error al dar el doble renderizado por parte
            // de StrictMode
            if(counter !== 2){
                setValidUrl(false);
            }
            // Colocar en entorno de producción
            // setValidUrl(false); 
            setResult(err);    
        })
        setCounter(prev => prev + 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {
                result ? (
                    (validUrl===true) ? (
                        <section className={styles.wrapper}>
                            <div className={styles.container}>
                                <img src={check} alt="Check" /><br /><br />
                                <h2>Correo verificado correctamente</h2>
                            </div>
                            <Button 
                            className={styles.button_login}
                            onClick={() => navigate("/inicio")}>
                                <IoArrowBackCircle className={styles.icon} /> Ingresar
                            </Button>
                        </section>
                    ):( validUrl===false && result.success === false &&
                        <Navigate to="/*" />
                )):
                (
                    <div className={`${styles.container_spinner}`}>
                        <Spinner size="lg" className={styles.spinner} animation="border" variant="info" />
                        <p className={styles.text_loading}>Cargando...</p>
                    </div>
                )
            }
        </>
    );
}

export default EmailVerifyPage;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';
import { getGeneralTreatmentXId } from 'services/GeneralTreatments';
import { UNEXPECTED_ERROR } from 'constants/InformationMessage';
import styles from './ServicePage.module.css';

const ServicePage = () => {

    const { serviceId } = useParams();
    const [ service, setService ] = useState(null);
    const [error, setError] = useState(false);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        getGeneralTreatmentXId(serviceId).then((response) => {
            setService(response.data.data);
        })
        .catch(err => {
            setError(true);
            
            if((err.response.status === 0 && err.response.data === undefined) || 
                (err.response.data.success === undefined && (err.response.status === 400 
                || err.response.status === 405 ||
                err.status === 500))) {
                setAlert({success: true, message: UNEXPECTED_ERROR});
                return;
            }
            setAlert({success: true, message: err.response.data.message});
        });
    }, [serviceId]);

    return (
        <section className={styles.container_service}>
            {error !== true ? (
                service !== null ? (
                    <>
                        <h2 className={styles.section_title}>{service.name}</h2>
                        <div className="mx-auto underline"></div>
                        <div className={styles.container}>
                            <p>{service.description}</p>
                            <img src={`${process.env.PUBLIC_URL}/img/dental-services/${service.imageUrl}`} alt={`Imagen de ${service.name}`} />
                        </div>
                    </>
                )
                : (
                    <div className={`${styles.container_spinner}`}>
                        <Spinner size="lg" className={styles.spinner} animation="border" variant="info" />
                        <p className={styles.text_loading}>Cargando...</p>
                    </div>
                )
            ) 
            : (
                <h2 className={styles.text_error}>
                    {alert.message}
                </h2>
            )}
        </section>
    );
}

export default ServicePage;
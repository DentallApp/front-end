import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';
import { getGeneralTreatmentXId } from '../../../services/GeneralTreatments';
import styles from './ServicePage.module.css';

const ServicePage = () => {

    const { serviceId } = useParams();
    const [ service, setService ] = useState(null);

    useEffect(() => {
        getGeneralTreatmentXId(serviceId).then((response) => {
            setService(response.data.data);
        });
    }, [serviceId]);

    return (
        <section className={styles.container_service}>
            {service != null ? (
                <>
                    <h2 className={styles.section_title}>{service.name}</h2>
                    <div className="mx-auto underline"></div>
                    <div className={styles.container}>
                        <p>{service.description}</p>
                        <img src={require(`../../../img/${service.imageUrl}`)} alt={`Imagen de ${service.name}`} />
                    </div>
                </>
            ) 
            : (
                <div className={`${styles.container_spinner}`}>
                    <Spinner size="lg" className={styles.spinner} animation="border" variant="info" />
                    <p className={styles.text_loading}>Cargando...</p>
                </div>
            )}
        </section>
    );
}

export default ServicePage;
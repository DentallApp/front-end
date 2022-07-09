import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import services from '../../../data/services';
import styles from './ServicePage.module.css';

const ServicePage = () => {

    const { serviceId } = useParams();
    const [ service, setService ] = useState(null);
    
    useEffect(() => {
        const result = services.filter(service => service.id === parseInt(serviceId));
        setService(result);
    }, [serviceId]);

    return (
        <section className={styles.container_service}>
            {service != null ? (
                <>
                    <h2 className={styles.section_title}>{service[0].name}</h2>
                    <div className="mx-auto underline"></div>
                    <div className={styles.container}>
                        <p>{service[0].description}</p>
                        <img src={service[0].img} alt={`Imagen de ${service[0].name}`} />
                    </div>
                </>
            ) 
            : (<p>Loading</p>)}
        </section>
    );
}

export default ServicePage;
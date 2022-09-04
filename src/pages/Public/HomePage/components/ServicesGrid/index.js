import { useContext, useEffect, useState } from 'react';
import Carousel from 'react-elastic-carousel';
import Spinner from 'react-bootstrap/Spinner';
import GeneralTreamentsContext from 'context/GeneralTreamentsContext';
import ServiceCard from '../ServiceCard';
import styles from './ServicesGrid.module.css';

const ServicesGrid = () => {
    const breakPoints = [
        { width: 1, itemsToShow: 1 },
        { width: 550, itemsToShow: 2 },
        { width: 850, itemsToShow: 3 },
        { width: 1150, itemsToShow: 4 },
        { width: 1450, itemsToShow: 5 },
        { width: 1750, itemsToShow: 6 },
    ];

    const { getGeneralTreatmentAll } = useContext(GeneralTreamentsContext);
    const [generalTreatments, setGeneralTreatments] = useState(null);

    useEffect(() => {
        const result = getGeneralTreatmentAll();
        setGeneralTreatments(result);
    }, [getGeneralTreatmentAll]);
  
    return (
        <>
            {generalTreatments != null ? (
                <Carousel breakPoints={breakPoints} className={`mx-auto ${styles.container}`}>
                    {generalTreatments.map(service => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </Carousel>
            ):
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

export default ServicesGrid;
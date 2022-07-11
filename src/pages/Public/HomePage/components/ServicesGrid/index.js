import { useContext } from 'react';
import Carousel from 'react-elastic-carousel';
import GeneralTreamentsContext from '../../../../../context/GeneralTreamentsContext';
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
    let generalTreatments = getGeneralTreatmentAll();
  
    return (
        <>
            {generalTreatments != null ? (
                <Carousel breakPoints={breakPoints} className={`mx-auto ${styles.container}`}>
                    {generalTreatments.map(service => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </Carousel>
            ):
                <div>Cargando</div>
            }
        </>
    );
}

export default ServicesGrid;
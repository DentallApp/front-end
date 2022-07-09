import services from '../../../../../data/services';
import ServiceCard from '../ServiceCard';
import styles from './ServicesGrid.module.css';

const ServicesGrid = () => {
    return (
        <ul className={styles.services_list}>
            {services.map(service => (
                <ServiceCard key={service.id} service={service} />
            ))}
        </ul>
    );
}

export default ServicesGrid;
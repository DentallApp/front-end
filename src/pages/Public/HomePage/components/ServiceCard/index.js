import { Link } from 'react-router-dom';
import styles from './ServiceCard.module.css';

const ServiceCard = ({service}) => {
    return (
        <li className={styles.service_card}>
            <Link 
            className={styles.link} 
            to={`/servicio/${service.id}`} 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <img className={styles.service_image} src={service.img} alt={service.name} />
                <div className={styles.service_name}>{service.name}</div>
            </Link>
        </li>
    );
}

export default ServiceCard;
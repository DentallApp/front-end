import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card'
import{ Button } from 'react-bootstrap';
import styles from './ServiceCard.module.css';

const ServiceCard = ({service}) => {
    const navigate = useNavigate();
    return (
        <Card className={styles.card_wrapper} style={{ width: '18rem' }}>
            <Card.Img variant="top" src={`${process.env.PUBLIC_URL}/img/dental-services/${service.imageUrl}`} alt={service.name} className={styles.image} />
            <Card.Body className={styles.card_body}>
                <h5>{service.name}</h5>
                <Button className={styles.button_detail} onClick={() => navigate(`/servicio/${service.id}`)}>Ver detalle</Button>
            </Card.Body>
        </Card>
    );
}

export default ServiceCard;
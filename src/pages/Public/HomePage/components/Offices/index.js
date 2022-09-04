import { useState, useEffect } from 'react';
import Carousel from 'react-elastic-carousel';
import Spinner from 'react-bootstrap/Spinner';
import OfficeCard from '../OfficeCard';
import { getOfficeHomePage } from 'services/OfficeScheduleService';
import styles from './Office.module.css';

const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2 },
    { width: 850, itemsToShow: 3 },
];

const Offices = () => {

    const [offices, setOffices] = useState(null);

    useEffect(() => {
        getOfficeHomePage().then(res => setOffices(res.data))
            .catch(err => err);
    }, []);

    return (
        <div className={styles.container_office}>
            <div className={styles.section_title}>
                <br/>
                <h2 className={styles.section_title}>Nuestros consultorios</h2>
                <div className="mx-auto underline"></div>
            </div>
            {
                    offices ? (
                        <Carousel breakPoints={breakPoints} className={`mx-auto ${styles.container}`}>
                            {offices.map((office, index) => (
                                <OfficeCard key={index} office={office} />
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
        </div>
    );
}

export default Offices;
import { useState, useEffect } from 'react';
import Carousel from 'react-elastic-carousel';
import Spinner from 'react-bootstrap/Spinner';
import lodash from 'lodash';
import AvailableHoursCard from '../AvailableHoursCard';
import styles from './ContainerAvailableHours.module.css';

const ContainerAvailableHours = ({availableHours, setValue}) => {
    const breakPoints = [
        { width: 1, itemsToShow: 1 },
        { width: 550, itemsToShow: 2 },
        { width: 850, itemsToShow: 3 },
        { width: 1150, itemsToShow: 4 },
        { width: 1450, itemsToShow: 5 },
        { width: 1750, itemsToShow: 6 },
    ];

    const [indexButton, setIndexButton] = useState(null);
    const [newArray, setNewArray] = useState(null)

    useEffect(() => {
        setNewArray(lodash.chunk(availableHours, 5));
    }, [indexButton, availableHours]);

    return (
        <>
            {newArray != null ? (
                <Carousel breakPoints={breakPoints} className={`mx-auto ${styles.container}`}>
                    {newArray.map((availableHour, index) => (
                        <AvailableHoursCard 
                        key={index} 
                        availableHour={availableHour} 
                        setIndexButton={setIndexButton}
                        indexButton={indexButton}
                        setValue={setValue} />
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

export default ContainerAvailableHours;
import { useState, useEffect } from 'react';
import{ Button } from 'react-bootstrap';
import styles from './ButtonHour.module.css';

const ButtonHour = ({hour, indexButton, setIndexButton, setValue}) => {

    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        if(indexButton !== null) {
            if(indexButton !== hour.id) setIsSelected(false);
            else setIsSelected(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [indexButton]);

    const selectHour = () => {
        setIndexButton(hour.id);
        setIsSelected(!isSelected);
        setValue('hours', hour, true);
    }

    return (
        <Button 
        key={hour.id}  
        className={`${isSelected === true ? styles.button_active : styles.button_hour}`}
        onClick={() => selectHour()}>
            {`${hour.startHour} - ${hour.endHour}`}
        </Button>
    );
}

export default ButtonHour;
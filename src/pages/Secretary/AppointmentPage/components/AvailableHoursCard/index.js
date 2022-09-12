import Card from 'react-bootstrap/Card'
import styles from './AvailableHoursCard.module.css';
import ButtonHour from '../ButtonHour';

const AvailableHoursCard = ({availableHour, indexButton, setIndexButton, setValue}) => {

    return (
        <Card className={styles.card_wrapper} style={{ width: '18rem' }}>
            <Card.Body style={{'width': '100%'}}>
                {
                    availableHour && (
                        <div className={styles.container_hours} > 
                        {
                            availableHour.map((hour) => (
                            
                                <ButtonHour 
                                hour={hour}
                                key={hour.id}
                                indexButton={indexButton}
                                setIndexButton={setIndexButton}
                                setValue={setValue}
                                />
                           
                            ))
                        }
                        </div>
                    )
                }
                
            </Card.Body>
        </Card>
    );
}

export default AvailableHoursCard;
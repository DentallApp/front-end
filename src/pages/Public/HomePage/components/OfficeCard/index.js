import { useState } from 'react';
import { ImOffice } from "react-icons/im";
import { FaMapMarkerAlt, FaCalendarAlt, FaPhone  } from 'react-icons/fa';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import { IoMdArrowRoundBack} from "react-icons/io";
import styles from './OfficeCard.module.css';
import { Button, Card, Col, Row } from 'react-bootstrap';

const OfficeCard = ({office}) => {
    const [isRotated, setIsRotated] = useState(false);

    const onRotate = () => setIsRotated(!isRotated);

    return (
        <Flippy
        flipDirection="horizontal"
        isFlipped={isRotated}
        >
            <FrontSide style={{"boxShadow": "none"}} >
                <Card className={`${styles.card_office}`} style={{ width: '18rem' }}>
                    <ImOffice className={styles.icon}/>
                        <h5>{office.name}</h5>
                        <br></br>
                        <div style={{"height":"100px"}}>
                            <h6><FaMapMarkerAlt /> Dirección</h6>
                            <p>{office.address}</p>
                        </div>    
                            <br />    
                            <h6><FaPhone /> Contacto</h6>
                            <p>{office.contactNumber ? office.contactNumber : 'N/A'}</p>
                        
                        <Button 
                        className={styles.button_view_schedule} 
                        onClick={() => onRotate() }> 
                            <FaCalendarAlt /> Ver Horarios
                        </Button>
                </Card>
                
            </FrontSide>
            <BackSide style={{"boxShadow": "none"}} >
                <Card className={`${styles.card_office}`} style={{ width: '18rem' }}>
                    <ImOffice className={styles.icon}/>
                    <h5>{office.name}</h5>
                    <br></br>
                    <h6><FaCalendarAlt /> Horarios</h6>
                    <div style={{"width": "100%", "minHeight":"165px"}}>
                    {
                        office.schedules.map((schedule, index) => (
                            <Row key={schedule.weekDayId} >
                                <Col><h6 className={styles.day}>{schedule.weekDayName}</h6></Col>
                                <Col>{schedule.schedule}</Col>
                            </Row>
                        ))
                    }
                    </div>
                    

                    <Button 
                    className={styles.button_back} 
                    onClick={() => onRotate() }> 
                        <IoMdArrowRoundBack /> Regresar
                    </Button>
                </Card>
            </BackSide>
        </Flippy>
    );
}

export default OfficeCard;
import { useState, useEffect } from 'react';
import APPOINTMENT_STATUS from 'constants/AppointmentStatus';
import styles from './DescriptionStatus.module.css';

const DescriptionStatus = ({listStatus}) => {
    const [statusAppointment, setStatusAppointment] = useState(listStatus);

    useEffect(() => {
        setStatusAppointment(listStatus);
        // eslint-disable-next-line react-hooks/exhaustive-deps     
    }, []);

    return (
        <div className={styles.wrapper}>
            {
                statusAppointment ? (
                    statusAppointment.map(data => (
                        <div className={styles.container_status} key={data.id}>
                            <div
                            className={styles.color_status} 
                            style={
                                {'backgroundColor': 
                                APPOINTMENT_STATUS.filter(status => status.name === data.name)[0].colorHex}
                            }>
                            </div>
                            <p>{data.name}</p>
                        </div>
                    ))
                ):<p>Cargando....</p>
            }            
        </div>
    );
}

export default DescriptionStatus;
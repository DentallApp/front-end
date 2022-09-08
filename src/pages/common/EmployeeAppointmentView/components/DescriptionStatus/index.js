import { useState, useEffect } from 'react';
import { getAppointmentStatus } from 'services/AppointmentStatusService';
import APPOINTMENT_STATUS from 'constants/AppointmentStatus';
import styles from './DescriptionStatus.module.css';

const DescriptionStatus = ({listStatus}) => {
    const [statusAppointment, setStatusAppointment] = useState(listStatus);

    useEffect(() => {
        setStatusAppointment(listStatus.filter(status => status.id === APPOINTMENT_STATUS[0].id || 
            status.id === APPOINTMENT_STATUS[2].id || status.id === APPOINTMENT_STATUS[4].id || 
            status.id === APPOINTMENT_STATUS[5].id)); 
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
                                APPOINTMENT_STATUS.filter(status => status.id === data.id)[0].colorHex}
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
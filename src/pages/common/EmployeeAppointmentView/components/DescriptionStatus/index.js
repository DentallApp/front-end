import { useState, useEffect } from 'react';
import { getAppointmentStatus } from 'services/AppointmentStatusService';
import APPOINTMENT_STATUS from 'constants/AppointmentStatus';
import styles from './DescriptionStatus.module.css';

const DescriptionStatus = () => {
    const [listStatus, setListStatus] = useState(null);

    useEffect(() => {
        getAppointmentStatus().then(res => {
            setListStatus(res.data.filter(status => status.id === APPOINTMENT_STATUS[0].id || 
            status.id === APPOINTMENT_STATUS[2].id || status.id === APPOINTMENT_STATUS[4].id || 
            status.id === APPOINTMENT_STATUS[5].id))
        })
        .catch(err => console.log(err));    
    }, []);

    return (
        <div className={styles.wrapper}>
            {
                listStatus ? (
                    listStatus.map(data => (
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
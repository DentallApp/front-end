import { ImOffice } from "react-icons/im";
import { FaMapMarkerAlt, FaCalendarAlt  } from 'react-icons/fa';
import styles from './Office.module.css';

const Offices = () => {
    return (
        <div className={styles.container_office}>
            <div className={styles.section_title}>
                <br/>
                <h2 className={styles.section_title}>Nuestros consultorios</h2>
                <div className="mx-auto underline"></div>
            </div>
            <div className={styles.container_card}>
                <div className={styles.card_office}>
                    <ImOffice className={styles.icon}/>
                    <h5>Guayaquil</h5>
                    <br></br>
                    <h6><FaMapMarkerAlt /> Dirección</h6>
                    <p>Mapasingue oeste Av4ta entre calle 4ta, y, Guayaquil 090101</p><br></br>
                    <h6><FaCalendarAlt /> Horario</h6>
                    <p>Lunes - Sábado</p>
                    <p>09:00AM - 19:00PM</p>
                </div>
                <div className={styles.card_office}>
                    <ImOffice className={styles.icon}/>
                    <h5>Rosario</h5>
                    <br></br>
                    <h6><FaMapMarkerAlt /> Dirección</h6>
                    <p>Vía principal Naranjito - Bucay, al lado de Ferreteria López</p><br></br>
                    <h6><FaCalendarAlt /> Horario</h6>
                    <p>Lunes - Sábado</p>
                    <p>09:00AM - 17:00PM</p>
                </div>
                <div className={styles.card_office}>
                    <ImOffice className={styles.icon}/>
                    <h5>El Triunfo</h5>
                    <br></br>
                    <h6><FaMapMarkerAlt /> Dirección</h6>
                    <p>Recinto el Piedrero frente al centro de salud</p><br></br>
                    <h6><FaCalendarAlt /> Horario</h6>
                    <p>Lunes - Sábado</p>
                    <p>09:00AM - 17:00PM</p>
                </div>
            </div>
        </div>
    );
}

export default Offices;
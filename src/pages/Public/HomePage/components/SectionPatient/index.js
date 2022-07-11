import { FaCalendarCheck, FaSearch, FaDonate } from 'react-icons/fa';
import styles from './SectionPatient.module.css';

const SectionPatient = () => {
    return(
        <div className={styles.container_section_patient}>
            <div className={styles.section_title}>
                <h2 className={styles.section_title}>Servicios en Línea</h2>
                <div className="mx-auto underline"></div>
                <p>Inicie sesión o cree una cuenta para:</p>
            </div>
            <div className={styles.container_card}>
                <div className={styles.card_service_patient}>
                    <FaCalendarCheck className={styles.icon}/>
                    <h5>Agendar cita</h5>
                    <br></br>
                    <p>Agende su cita eligiendo fecha, hora, especilidad y doctor que usted desee</p>
                </div>
                <div className={styles.card_service_patient}>
                    <FaSearch className={styles.icon}/>
                    <h5>Consultar cita</h5>
                    <br></br>
                    <p>Consulte el historial de las citas que ha realizado</p>
                </div>
                <div className={styles.card_service_patient}>
                    <FaDonate className={styles.icon}/>
                    <h5>Cotizar servicios</h5>
                    <br></br>
                    <p>Cotize los precios de los tratamientos dentales disponibles</p>
                </div>
            </div>
        </div>
    );
}

export default SectionPatient;
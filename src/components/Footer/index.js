import { FaPhoneSquareAlt, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import { logo } from '../../img';
import styles from './Footer.module.css';

const Footer = () => {

    const currentDate = new Date();
    
    return(
        <footer>
          <div className={styles.main_content}>
            <div className={styles.left}>
              <img src={ logo } alt="World Dental Logo" />
            </div>
            <div className={`${styles.center} ${styles.box}`}>
              <h2 className={styles.section_title}>Contáctanos</h2>
              <div className={styles.content}>
                <div className={styles.place}>
                  <span><FaMapMarkerAlt /></span>
                  <p className={styles.text}>Mapasingue oeste Av4ta entre calle 4ta, y, Guayaquil 090101</p>
                </div>
                <div className={styles.phone}>
                  <span><FaPhoneSquareAlt /></span>
                  <span className={styles.text}> 0980852228</span>
                </div>
                <div className={styles.email}>
                  <span><FaEnvelope /></span>
                  <span className={styles.text}>algo@mail.com</span>
                </div>
              </div>
            </div>

            <div className={`${styles.right} ${styles.box}`}>
              <h2>Horarios</h2>
              <div className={styles.content}>
                <h5>Lunes - Viernes</h5>
                <p>09:00 - 17:00</p>
                <br></br>

                <h5>Sábado</h5>
                <p>09:00 - 14:00</p>
              </div>
            </div>
          </div>
          <div className={styles.footer_bottom}>
              <p>All right reserved by &copy;World Dental {currentDate.getFullYear()} </p>
          </div>
        </footer>
    );
}

export default Footer;
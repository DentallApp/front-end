import { FaPhoneSquareAlt, FaEnvelope, FaFacebook,FaInstagramSquare } from 'react-icons/fa';
import { logo } from 'img';
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
                <div className={styles.phone}>
                  <FaPhoneSquareAlt className={styles.icon} />
                  <span className={styles.text}> 0980852228</span>
                </div>
                <div className={styles.email}>
                  <FaEnvelope className={styles.icon}/>
                  <span className={styles.text}>jloorbowen@gmail.com</span>
                </div>
              </div>
            </div>

            <div className={`${styles.box}`}>
              <h2 className={styles.section_title}>Redes Sociales</h2>
              <div className={`${styles.content} ${styles.container_social}`}>
                <a href='https://www.facebook.com/worlddentalco' rel='noreferrer' target='_blank'> 
                  <FaFacebook className={styles.icon} />
                </a>
                <a href='https://www.instagram.com/worlddentalco/' rel='noreferrer' target='_blank'>
                  <FaInstagramSquare className={styles.icon} />
                </a>
              </div>
            </div>
          </div>
          <div className={styles.footer_bottom}>
              <p>All right reserved by &copy;{process.env.REACT_APP_BUSINESS_NAME} {currentDate.getFullYear()} </p>
          </div>
        </footer>
    );
}

export default Footer;
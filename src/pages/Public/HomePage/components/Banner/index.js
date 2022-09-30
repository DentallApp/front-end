import{ Button } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import { dentalBanner } from 'img';
import styles from './Banner.module.css';

const Banner = () => {
    return (
        <div className={styles.container_baner_diagonal}>
            <div className={styles.container_baner_text}>
                <h1>BIENVENIDO A {process.env.REACT_APP_BUSINESS_NAME.toUpperCase()}</h1>
                <h5>Contamos con profesionales que te ayudarán a cuidar tu sonrisa</h5>
                <a href="#services"><Button className={styles.button_explore}> <FaArrowRight /> Conozca nuestros servicios</Button></a>
            </div>
            <div className={styles.container_image_baner}>
                <img className={styles.baner_image} src={ dentalBanner } alt="baner" />
            </div>
        </div>
    );
}

export default Banner;
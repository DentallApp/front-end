import { imageAbout } from 'img';
import styles from './AboutPage.module.css';

const AboutPage = () => {
    return (
        <section className={styles.container}>
            <h2 className={styles.section_title}>Nosotros</h2>
            <div className="mx-auto underline"></div>
            <div className={styles.container_content}>
                <div className={styles.container_image}>
                    <img src={imageAbout} alt="about"/>
                </div>
                <div className={styles.container_text}>
                    <p className={styles.text}>
                        Consultorio Odontológico {process.env.REACT_APP_BUSINESS_NAME} ofrece todo tipo de tratamiento de ortodoncia, endodoncias, 
                        extracciones, curaciones, limpiezas, prótesis(placas). Brindamos una atención tanto para adultos 
                        como para niños.
                    </p>
                    <p className={styles.text}>
                        Contamos con un equipo de profesionales especializados en tratamientos dentales que les brindará
                        una atención personalizada y de calidad a cada cliente.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default AboutPage; 
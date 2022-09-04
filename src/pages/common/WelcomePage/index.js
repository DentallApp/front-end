import { getLocalUser } from 'services/UserService';
import { asistente_robot } from 'img';
import styles from './WelcomePage.module.css'

const WelcomePage = () => {

    const user = getLocalUser();

    return (
        <div className={styles.container_page}>
            <h1 className={styles.page_title}>{ user.genderId === 1 ? 'Bienvenido' : 'Bienvenida'}</h1>
            <div className="underline mx-auto"></div>
            <h2 className={styles.fullname_user}>{`${user.fullName}`}</h2>
            <img className={styles.gif} src={asistente_robot} alt="Asistente robot" />
        </div>
    );
}

export default WelcomePage;
import { dentalBanner } from 'img';
import { RegisterForm } from './components';
import styles from './RegisterPage.module.css';

const RegistrationPage = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.wrapper_content}>
                <div className={styles.container} >
                    <RegisterForm />
                    <img className={styles.image_container} src={dentalBanner} alt="logo" />
                </div>
            </div>
        </div>
    );
}

export default RegistrationPage;
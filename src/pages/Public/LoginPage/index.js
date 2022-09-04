import { FormLogin } from './components';
import styles from './LoginPage.module.css'; 
import { dentalBanner } from 'img';

const LoginPage = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.wrapper_content}>
                <div  className={styles.container} >
                    <FormLogin />
                    <img className={styles.image_container} src={dentalBanner} alt="logo" />
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
import { FormForgotPassword } from './components';
import styles from '../LoginPage/LoginPage.module.css'; 
import { dentalBanner } from 'img';

const ForgotPasswordPage = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.wrapper_content}>
                <div  className={styles.container} >
                    <FormForgotPassword />
                    <img className={styles.image_container} src={dentalBanner} alt="logo" />
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
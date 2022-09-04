import { FormResetPassword } from './components';
import styles from '../LoginPage/LoginPage.module.css'; 
import { dentalBanner } from 'img';

const ResetPasswordPage = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.wrapper_content}>
                <div  className={styles.container} >
                    <FormResetPassword />
                    <img className={styles.image_container} src={dentalBanner} alt="logo" />
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordPage;
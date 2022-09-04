import { Outlet } from 'react-router-dom';
import { Header, Footer } from 'components';
import GeneralTreamentsProvider from 'context/GeneralTreamentsProvider';
import styles from './PublicPage.module.css';

const PublicPage = () => {
    return (
        <div className={styles.wrapper}>
            <GeneralTreamentsProvider>
                <Header />
                    <Outlet />
                <Footer />
            </GeneralTreamentsProvider>
        </div>
    );
}

export default PublicPage;
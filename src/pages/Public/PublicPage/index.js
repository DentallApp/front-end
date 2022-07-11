import { Outlet } from 'react-router-dom';
import { Header, Footer } from '../../../components';
import GeneralTreamentsProvider from '../../../context/GeneralTreamentsProvider';

const WithNav = () => {
    return (
        <GeneralTreamentsProvider>
            <Header />
                <Outlet />
            <Footer />
        </GeneralTreamentsProvider>
    );
}

export default WithNav;
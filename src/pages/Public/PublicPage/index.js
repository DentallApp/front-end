import { Outlet } from 'react-router-dom';
import { Header, Footer } from '../../../components';

const WithNav = () => {
    return (
        <div>
            <Header />
                <Outlet />
            <Footer />
        </div>
    );
}

export default WithNav;
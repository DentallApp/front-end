import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { 
    HomePage, 
    AboutPage, 
    ServicePage, 
    LoginPage, 
    RegisterPage, 
    PublicPage 
} from '../pages/Public';

import { NotFoundPage } from '../pages/common';

const RoutesApp = () => {
    return (
        <Router>
            <Routes>
                <Route element={<PublicPage />}>
                    <Route index element={<HomePage />} />
                    <Route path="/nosotros" element={<AboutPage />}/>
                    <Route path="/servicio/:serviceId" element={<ServicePage />}/>
                    <Route path="*" element={<NotFoundPage />}/>
                </Route>
                <Route path="/login" element={<LoginPage />}/>
                <Route path="/registro" element={<RegisterPage />}/>
            </Routes>
        </Router>
    );
}

export default RoutesApp;
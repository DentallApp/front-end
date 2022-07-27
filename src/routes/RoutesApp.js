import ROLES from '../constants/Roles';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { 
    HomePage, 
    AboutPage, 
    ServicePage, 
    LoginPage, 
    RegisterPage, 
    PublicPage, 
    EmailVerifyPage,
    ForgotPasswordPage,
    ResetPasswordPage
} from '../pages/Public';

import { Dashboard, NotFoundPage, UnauthorizedPage } from '../pages/common';
import { AppointmentPage, DependentPage, HomePatientPage } from '../pages/Patient';
import { AppointmentCalendarPage } from '../pages/Dentist';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const RoutesApp = () => {
    return (
        <Router>
            <Routes>
                {/* Rutas públicas */}
                <Route element={ <PublicRoute /> }>
                    <Route element={<PublicPage />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/nosotros" element={<AboutPage />}/>
                        <Route path="/servicio/:serviceId" element={<ServicePage />}/>
                    </Route>
                    <Route path="/login" element={<LoginPage />}/>
                    <Route path="/registro" element={<RegisterPage />}/>
                    <Route path="/recuperar-contrasena" element={<ForgotPasswordPage />} />
                    <Route path="/verificacion-correo" element={<EmailVerifyPage />} />
                    <Route path="/resetear-contrasena" element={<ResetPasswordPage />} />
                </Route>

                {/* Rutas privadas para Usuario básico */}
                <Route element={<PrivateRoute role={ROLES.BASIC_USER} />}>
                    <Route element={<Dashboard />}>
                        <Route path="/inicio" element={<HomePatientPage />}/>
                        <Route path="/agendamiento" element={<AppointmentPage />}/>
                        <Route path="/gestion-dependientes" element={<DependentPage />}/>
                    </Route>
                </Route>

                {/* Rutas privadas para Usuario básico */}
                <Route element={<PrivateRoute role={ROLES.DENTIST} />}>
                    <Route element={<Dashboard />}>
                        <Route path="/inicio" element={<HomePatientPage />}/>
                        <Route path="/calendario-de-citas" element={<AppointmentCalendarPage />} />
                    </Route>
                </Route>

                <Route path="/no-autorizado" element={<UnauthorizedPage />}/>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}

export default RoutesApp;
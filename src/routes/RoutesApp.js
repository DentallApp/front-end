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

import { 
    Dashboard, 
    WelcomePage, 
    NotFoundPage, 
    SessionExpiredPage, 
    UnauthorizedPage, 
    ChangePasswordPage,
    UserManagementPage,
    EditProfilePage } from '../pages/common';
import { AppointmentChatbotPage, AppointmentHistory, DependentPage, QuotationPage } from '../pages/Patient';
import { AppointmentCalendarPage } from '../pages/Dentist';
//import { AppointmentPage } from '../pages/Secretary';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import { GeneralServicePage, TreatmentPage } from '../pages/SuperAdmin';

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
                <Route element={<PrivateRoute role={[ROLES.BASIC_USER]} />}>
                    <Route element={<Dashboard />}>
                        <Route path="/agendamiento/chatbot" element={<AppointmentChatbotPage />}/>
                        <Route path="/lista-citas" element={<AppointmentHistory />}/>
                        <Route path="/gestion-dependientes" element={<DependentPage />}/>
                        <Route path={'/cotizacion'} element={<QuotationPage />} />
                    </Route>
                </Route>

                {/* Rutas privadas para el odontólogo */}
                <Route element={<PrivateRoute role={[ROLES.DENTIST]} />}>
                    <Route element={<Dashboard />}>
                        <Route path="/calendario-de-citas" element={<AppointmentCalendarPage />} />
                    </Route>
                </Route>

                {/* Rutas privadas para el administrador */}
                {/*<Route element={<PrivateRoute role={[ROLES.SECRETARY]} />}>
                    <Route element={<Dashboard />}>
                        <Route path="/agendamiento-citas" element={<AppointmentPage />} />
                    </Route>
                </Route>*/}
                
                {/* Rutas privadas para el superadministrador */}
                {<Route element={<PrivateRoute role={[ROLES.SUPERADMIN]} />}>
                    <Route element={<Dashboard />}>
                        <Route path="/gestion-servicio" element={<GeneralServicePage />} />
                        <Route path="/gestion-tratamientos" element={<TreatmentPage />} />
                    </Route>
                </Route>}

                {/* Rutas privadas para los roles de Administrador y Superadministrador */}
                <Route element={<PrivateRoute 
                role={[ROLES.ADMIN, ROLES.SUPERADMIN]} />}>
                    <Route element={<Dashboard />}>
                        <Route path={'/gestion-usuarios'} element={<UserManagementPage />} />
                    </Route>
                </Route>

                {/* Rutas privadas para todos los roles */}
                <Route element={<PrivateRoute 
                role={[ROLES.BASIC_USER, ROLES.DENTIST, ROLES.SECRETARY, ROLES.ADMIN, ROLES.SUPERADMIN]} />}>
                    <Route element={<Dashboard />}>
                        <Route path={`/inicio`} element={<WelcomePage />}/>
                        <Route path={'/cambio-contrasena'} element={<ChangePasswordPage />} />
                        <Route path={'/perfil'} element={<EditProfilePage />} />
                    </Route>
                </Route>

                <Route path="/no-autorizado" element={<UnauthorizedPage />}/>
                <Route path="/sesion-expirada" element={<SessionExpiredPage />}/>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}

export default RoutesApp;
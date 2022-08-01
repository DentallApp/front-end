import { useEffect } from 'react'; 
import { Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { getLocalUser } from '../services/UserService';
import ROLES from '../constants/Roles';

const PublicRoute = () => {

    const navigate = useNavigate()
    const user = getLocalUser();
    const location = useLocation();
    const protectedPaths = ["/inicio", "/inicio-superadministrador"];

    useEffect(() => {
        if(user !== null) navigate(user.roles[0].includes(ROLES.BASIC_USER) ? "/inicio" : `/inicio-${user.roles[0].toLowerCase()}`, 
        {state:location});
    }, [navigate, location, user]);
    
    return (
        <>
            {
                user === null || user === undefined ? (
                    <Outlet />
                ):(
                    !protectedPaths.includes(location.pathname) ? 
                    (
                        <Navigate 
                        to={user.roles[0].includes(ROLES.BASIC_USER) ? '/inicio' 
                        : `/inicio-${user.roles[0].toLowerCase()}`} state={{from: location}} />
                    ) : 
                    (
                        <Navigate 
                        to={user.roles[0].includes(ROLES.BASIC_USER) ? '/inicio' 
                        : `/inicio-${user.roles[0].toLowerCase()}`} state={{from: location}} />
                    )
                )
            }
        </>
    );
}

export default PublicRoute;
import { useEffect } from 'react'; 
import { Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { getLocalUser } from 'services/UserService';
import { getLocalAccessToken } from 'services/TokenService';

const PublicRoute = () => {

    const navigate = useNavigate()
    const user = getLocalUser();
    const location = useLocation();
    const protectedPaths = ["/inicio"];

    useEffect(() => {
        if(user !== null && user !== undefined && getLocalAccessToken() !== null && getLocalAccessToken() !== undefined) navigate("/inicio", 
        {state:location});
    }, [navigate, location, user]);
    
    return (
        <>
            {
                (user === null || user === undefined) || 
                (getLocalAccessToken() === null || getLocalAccessToken() === undefined) ? (
                    <Outlet />
                ):(
                    !protectedPaths.includes(location.pathname) ? 
                    (
                        <Navigate 
                        to={'/inicio'} state={{from: location}} />
                    ) : 
                    (
                        <Navigate 
                        to={'/inicio'} state={{from: location}} />
                    )
                )
            }
        </>
    );
}

export default PublicRoute;
import { useEffect } from 'react'; 
import { Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { getLocalUser } from '../services/UserService';


const PublicRoute = () => {

    const navigate = useNavigate()
    const user = getLocalUser();
    const location = useLocation();
    const protectedPaths = ["/inicio"];

    useEffect(() => {
        if(user !== null) navigate("/inicio", {state:location});
    }, [navigate, location, user]);
    
    return (
        <>
            {
                user === null || user === undefined ? (
                    <Outlet />
                ):(
                    !protectedPaths.includes(location.pathname) ? 
                    (<Navigate to="/inicio" state={{from: location}} />) : (<Navigate to="/inicio" state={{from: location}} />)
                )
            }
        </>
    );
}

export default PublicRoute;
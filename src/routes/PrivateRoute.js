import { useEffect } from 'react'; 
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"
import { getLocalUser } from 'services/UserService';
import { getLocalAccessToken } from 'services/TokenService';

const PrivateRoute = ({ role }) => {
    const navigate = useNavigate()
    const user = getLocalUser();
    const location = useLocation();
    const unProtectedPaths = ["/login"];

    useEffect(() => {
        if((user === null || user === undefined) || (getLocalAccessToken() === null || getLocalAccessToken() === undefined)) 
            navigate("/login", {state:location});
    }, [navigate, location, user]);

    return (
        <>
            {
                user ? (
                    getLocalAccessToken() ? (
                        user.roles.some(r => role.includes(r)) ? (
                            <Outlet />
                        )
                        : (
                            <Navigate to="/no-autorizado" />
                        )
                    ) : 
                        ((!unProtectedPaths.includes(location.pathname)) ? 
                        (<Navigate to="/login" state={{from: location}} />) : (<Navigate to="/login" state={{from: location}} />))
                   
                ): (
                
                    !unProtectedPaths.includes(location.pathname) ? 
                    (<Navigate to="/login" state={{from: location}} />) : (<Navigate to="/login" state={{from: location}} />))
                
            }
        </>
    ) 
}

export default PrivateRoute;
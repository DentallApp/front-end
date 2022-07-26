import { Navigate, Outlet } from 'react-router-dom';
import { getLocalUser } from '../services/UserService';

const user = getLocalUser();

const PublicRoute = () => {
    return (
        <>
            {
                user === null || user === undefined ? (
                    <>
                        <Outlet />
                    </>
                ):(
                    <Navigate to="/inicio" replace={true}/>
                )
            }
        </>
    );
}

export default PublicRoute;
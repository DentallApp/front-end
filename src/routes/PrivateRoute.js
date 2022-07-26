import { Navigate, Outlet } from "react-router-dom"
import { getLocalUser } from '../services/UserService';



const PrivateRoute = ({ role }) => {
    const user = getLocalUser();
    return (
        <>
            {
                user ? (
                    user.accessToken ? (
                        user.roles.includes(role) ? (
                            <Outlet />
                        )
                        : (
                            <Navigate to="/no-autorizado" />
                        )
                    ) : 
                    (
                        <Navigate to="/login" replace={true}/>
                    )
                ) : 
                (
                    <Navigate to="/login" replace={true}/>
                )
            }
        </>
    ) 
}

export default PrivateRoute;
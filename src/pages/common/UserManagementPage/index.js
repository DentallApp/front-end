import { UserManagementPage as AdminPage } from '../../Admin';
import { UserManagementPage as SuperAdminPage } from '../../SuperAdmin';
import ROLES from '../../../constants/Roles';
import { getLocalUser } from '../../../services/UserService';

const UserManagementPage = () => {

    const user = getLocalUser();

    return (
        <>
            { user.roles.includes(ROLES.ADMIN) ? <AdminPage /> : <SuperAdminPage />}
        </>
    );
}

export default UserManagementPage;
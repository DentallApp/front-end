import EditProfileEmployeePage from '../EditProfileEmployeePage';
import { EditProfilePage as EditProfileBasicUserPage } from '../../Patient';
import ROLES from '../../../constants/Roles';
import { getLocalUser } from '../../../services/UserService';

const EditProfilePage = () => {

    const user = getLocalUser();

    return (
        <>
            { user.roles.includes(ROLES.BASIC_USER) ? <EditProfileBasicUserPage /> : <EditProfileEmployeePage />}
        </>
    );
}

export default EditProfilePage;
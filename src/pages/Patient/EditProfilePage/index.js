import { useState } from 'react';
import FormProfile from './components/FormProfile';
import { AlertMessage, ModalLoading } from 'components';
import { getLocalUser } from 'services/UserService';
import styles from './EditProfilePage.module.css';

const EditProfilePage = () => {
    const user = getLocalUser();
    const [isLoading, setIsLoading] = useState(null);
    const [alert, setAlert] = useState(null);

    return (
        <>
            { isLoading ? (isLoading.success === undefined ? <ModalLoading show={true} /> : "") : ""}
            <div className={styles.wrapper}>
                <h1 className={'page_title'}>Editar Perfil</h1>
                <div className="underline mx-auto"></div>
                <p className={styles.text_information}>Los campos con el símbolo * son obligatorios</p>
                { 
                    alert && 
                    <AlertMessage 
                    type={ alert.success === false ? 'danger' : 'success' }
                    message={ alert.message }
                    setError= { setAlert }  /> 
                }
                <FormProfile user={user} setIsLoading={setIsLoading} setAlert={setAlert}/>
            </div>
        </>
    );
}

export default EditProfilePage;
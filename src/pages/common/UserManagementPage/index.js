import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { IoAddCircle } from "react-icons/io5";
import { UsersTable, FormModal, EliminationModal } from './components';
import { AlertMessage, ModalLoading, FilterComponent } from '../../../components';
import { trimSpaces, capitalizeFirstLetter } from '../../../utils/stringUtils';
import { getLocalUser } from '../../../services/UserService';
import ROLES from '../../../constants/Roles';
import { createEmployee, getEmployee, updateEmployee, deleteEmployee } from '../../../services/EmployeeService';
import styles from './UserManagementPage.module.css';

const UserManagementPage = () => {
    const user = getLocalUser();
    // Estados para el filtro
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    // Estado para los datos de la tabla
    const [dataUsers, setDataUsers] = useState(null);
    const [isChange, setIsChange] = useState(false);
    const [filterUsers, setFilterUsers] = useState([]);

    // Estado para el modal de creación y actualización de información de dependientes
    const [show, setShow] = useState(false);
    const [rowSelect, setRowSelect] = useState(null);

    // Estado para el modal de eliminación de dependientes 
    const [typeModal, setTypeModal] = useState('form');

    // Estado para el mensaje de alerta
    const [alert, setAlert] = useState(null);

    // Estado para el modal de carga 
    const [isLoading, setIsLoading] = useState(null);

    useEffect(() => {
        getEmployee().then(res => {
            setDataUsers(res.data);
            setFilterUsers(res.data);
        })
        .catch(err => console.log(err));
    }, [isChange]);
     
    useEffect(() => {
        if(filterUsers.length > 0 && filterText !== '') filterData();
        
        if(filterUsers?.length <= 0 || filterText === '') setFilterUsers(dataUsers);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText]);

    const filterData = () => {
        const data = dataUsers.filter(user => 
            user.document.toString().includes(filterText.toLocaleLowerCase()) === true || 
            user.names.toString().toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) === true ||
            user.lastNames.toString().toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) === true ||
            user.officeName.toString().toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) === true
           
        );
        setFilterUsers(data);
    }

    // Función que capta los datos que se ingresa en el input y realiza el filtro de la tabla 
    const handleChange = (e) => {
        setFilterText(e.target.value.toString());
        if(filterText === '' || filterUsers.length <= 0) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterUsers(dataUsers);
        }
    }

    // Función que limpia los campos del input y resetea la tabla
    const handleClear = () => {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterUsers(dataUsers);
        setFilterText('');
    };

    // Funciones para cerrar y mostrar el modal
    const handleClose = () => { 
        setShow(false);
        setRowSelect(null);
    }
    const handleShow = () => setShow(true);

    // Función guardar y actualizar datos de los dependientes
    const saveUser = async (data, reset, type) => {
        // Se elimina espacios innecesarios
        const sanitizedName = trimSpaces(data.names);
        const sanitizedLastName = trimSpaces(data.lastNames);

        // Se convierte a mayúscula la primer letra de cada palabra
        data.names = capitalizeFirstLetter(sanitizedName);
        data.lastNames = capitalizeFirstLetter(sanitizedLastName);
        data.genderId = parseInt(data.genderId);
        data.officeId = user.roles.includes(ROLES.SUPERADMIN) ? parseInt(data.officeId) : user.officeId;
        data.roles = data.roleId.map(role => parseInt(role));

        setIsLoading({success: undefined});

        if(type === 'create') {
            const result = await createEmployee(data);
            if(result.success && result.success === true) setIsChange(!isChange);
            
            setIsLoading({success: result.success});
            setAlert(result);
        }    
        else {
            data.employeeId = rowSelect.employeeId;
            
            const result = await updateEmployee(data);
            if(result.success && result.success === true) setIsChange(!isChange);
            
            setIsLoading({success: result.success});
            setAlert(result);
        }

        handleClose();
        reset();
        setRowSelect(null);
    }

    const eliminateUser = async(data) => {
        setIsLoading({success: undefined});
        const result = await deleteEmployee(data);
        
        if(result.success && result.success === true) setIsChange(!isChange);
        
        setIsLoading({success: result.success});
        handleClose();
        setAlert(result);
        setRowSelect(null);
    }

    return (
        <>
            { isLoading ? (isLoading.success === undefined ? <ModalLoading show={true} /> : "") : ""}
            { /* Ventana modal para el registro, actualización y eliminación de dependiente  */
                show === true ? (
                    typeModal === 'form' ? (
                        <FormModal 
                        handleClose={handleClose} 
                        show={show}
                        saveUser={saveUser}
                        alert={alert}
                        setAlert={setAlert}
                        userSelect={rowSelect} /> 
                    ):(
                        <EliminationModal
                        handleClose={handleClose} 
                        show={show}
                        userSelect={rowSelect}
                        alert={alert}
                        setAlert={setAlert}
                        eliminateUser={eliminateUser}
                         />
                    )
                ):<></>
            }
            <h1 className={styles.page_title}>Gestión de Usuarios</h1>
            { /* Mensaje de alerta para mostrar información al usuario */
                alert && 
                <div className={styles.container_alert}>
                    <AlertMessage 
                    type={ alert.success === false ? 'danger' : 'success' }
                    message={ alert.message }
                    setError= { setAlert }  /> 
                </div>
            }
            <div className={styles.container_header}>
                <Button 
                className={styles.button_add} 
                onClick={() => {
                    setTypeModal('form');
                    handleShow();
                }}> 
                    <IoAddCircle className={styles.icon} /> Nuevo
                </Button>
                <FilterComponent 
                onFilter={handleChange} 
                onClear={handleClear} 
                filterText={filterText}
                setFilterText={setFilterText}
                inputText="Ingrese usuario a buscar"
                className={styles.filter} />
            </div>
            {
                filterUsers ? (
                    <UsersTable 
                        styles="margin-bottom: 40px;" 
                        users={filterUsers} 
                        paginationResetDefaultPage={resetPaginationToggle}
                        handleShow={handleShow}
                        setTypeModal={setTypeModal}
                        setUserSelect={setRowSelect} />
                ): 
                (
                    <div className={`${styles.container_spinner}`}>
                        <Spinner size="lg" className={styles.spinner} animation="border" variant="info" />
                        <p className={styles.text_loading}>Cargando...</p>
                    </div>
                )
            }
        </>
    );
}

export default UserManagementPage;
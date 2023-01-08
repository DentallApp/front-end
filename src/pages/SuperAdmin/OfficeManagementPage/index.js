import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { IoAddCircle } from "react-icons/io5";
import { AlertMessage, ModalLoading, FilterComponent } from 'components';
import { OfficeTable, FormModal } from './components';
import { getAllOffices, createOffice, updateOffice } from 'services/OfficeService';
import { handleErrors, handleErrorLoading } from 'utils/handleErrors';
import styles from './OfficeManagementPage.module.css';

const OfficeManagementPage = () => {
    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});
    // Estados para el filtro
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    // Estado para los datos de la tabla
    const [offices, setOffices] = useState(null);
    const [filterOffices, setFilterOffices] = useState([]);

    // Estado para el modal de creación y actualización de información de usuarios
    const [show, setShow] = useState(false);
    const [rowSelect, setRowSelect] = useState(null);

    // Estado para el mensaje de alerta
    const [alert, setAlert] = useState(null);

    // Estado para el modal de carga 
    const [isLoading, setIsLoading] = useState(null);

    useEffect(() => {
        getAllOffices().then(res => {
            setOffices(res.data);
            setFilterOffices(res.data);
        })
            .catch(err => handleErrorLoading(err, setErrorLoading))
        // eslint-disable-next-line react-hooks/exhaustive-deps    
    }, []);
     
    useEffect(() => {
        if(filterOffices?.length > 0 && filterText !== '') filterData();
        
        if(filterOffices?.length <= 0 || filterText === '') setFilterOffices(offices);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText]);

    const filterData = () => {
        const data = offices.filter(office => 
            office.name.toString().toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) === true 
           
        );
        setFilterOffices(data);
    }

    // Función que capta los datos que se ingresa en el input y realiza el filtro de la tabla 
    const handleChange = (e) => {
        setFilterText(e.target.value.toString());
        if(filterText === '' || filterOffices.length <= 0) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterOffices(offices);
            return;
        }

        filterData();
    }

    // Función que limpia los campos del input y resetea la tabla
    const handleClear = () => {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterOffices(offices);
        setFilterText('');
    };

    // Funciones para cerrar y mostrar el modal
    const handleClose = () => { 
        setShow(false);
        setRowSelect(null);
    }
    const handleShow = () => setShow(true);

    const create = async(data) => {
        const result = await createOffice(data);
        if(result.success && result.success === true) {
            result.message = 'Consultorio creado con éxito';
            addNewOffice(data, parseInt(result.data.id));
            setFilterText('');
        }

        setIsLoading({success: result.success});
        setAlert(result);

        return result;
    }

    const edit = async(data) => {
        const result = await updateOffice(data);
        if(result.success && result.success === true) {
            result.message = 'Consultorio actualizado exitosamente';
            const newList = offices.map(office => 
                office.id === data.id ? { ...office, ...data} : office    
            );
            setOffices(newList);
            setFilterOffices(newList);
        }
            
        setIsLoading({success: result.success});
        setAlert(result);

        return result;
    }

    const saveOffice = async(data, reset, type) => {

        // Se elimina espacios innecesarios
        const sanitizedName = data.name.trim();
        const sanitizedAddress = data.address.trim();

        // Se convierte a mayúscula la primer letra
        data.name = sanitizedName.charAt(0).toUpperCase() + sanitizedName.slice(1);
        data.address = sanitizedAddress.charAt(0).toUpperCase() + sanitizedAddress.slice(1);

        data.id = parseInt(data.id);
        data.isDeleted = parseInt(data.isDeleted) === 1 ? false : true;
        data.isCheckboxTicked = data.isDeleted === false ? true : data.isCheckboxTicked;
        
        let result = null;
        setIsLoading({success: undefined});

        if(type === 'create') result = await create(data);
        else result = await edit(data);

        handleErrors(result, setAlert, setIsLoading);
        handleClose();
        reset();
        setRowSelect(null);
    }

    const addNewOffice = (data, newOfficeId) => {
        data.id = newOfficeId;

        setOffices([
            ...offices,
            data
        ]);

        setFilterOffices([
            ...offices,
            data
        ]);
    }

    return (
        <>
            { isLoading ? (isLoading.success === undefined ? <ModalLoading show={true} /> : "") : ""}
            { /* Ventana modal para el registro, actualización y eliminación de dependiente  */
                show === true && (
                    <FormModal
                    handleClose={handleClose} 
                    show={show}
                    specificTreatmentSelect={rowSelect}
                    officeSelect={rowSelect}
                    saveOffice={saveOffice} />         
                )
            }   
            <h1 className={'page_title'}>Gestión de Consultorios</h1>
            <div className="underline mx-auto"></div>
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
                    handleShow();
                }}> 
                    <IoAddCircle className={styles.icon} /> Nuevo
                </Button>
                {errorLoading.success === false && (
                    <FilterComponent 
                    onFilter={handleChange} 
                    onClear={handleClear} 
                    filterText={filterText}
                    setFilterText={setFilterText}
                    inputText="Ingrese consultorio a buscar"
                    className={styles.filter} />
                )}       
            </div>
            
            {
                errorLoading.success === false ?  (
                    filterOffices ? (
                        <OfficeTable 
                            styles="margin-bottom: 40px;" 
                            offices={filterOffices} 
                            paginationResetDefaultPage={resetPaginationToggle}
                            handleShow={handleShow}
                            setOfficeSelect={setRowSelect} 
                            />
                    ): 
                    (
                        <div className={`${styles.container_spinner}`}>
                            <Spinner size="lg" className={styles.spinner} animation="border" variant="info" />
                            <p className={styles.text_loading}>Cargando...</p>
                        </div>
                    )
                ):(
                    <h4 className={styles.text_error}>
                        {errorLoading.message}
                    </h4>
                )
            }

        </>
    );
}

export default OfficeManagementPage;
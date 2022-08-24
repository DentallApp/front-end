import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { IoAddCircle } from "react-icons/io5";
import { GeneralServiceTable, FormModal, EliminationModal } from './components';
import { AlertMessage, ModalLoading, FilterComponent } from '../../../components';
import { createTreatment, getGeneralTreatmentEdit, updateTreatment, deleteTreatment } from '../../../services/GeneralTreatments';
import { HoursToMinutes } from '../../../utils/timeUtils';
import styles from './GeneralServicePage.module.css';

const GeneralServicePage = () => {

    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});
    
    // Estados para el filtro
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    // Estado para los datos de la tabla
    const [dataServices, setDataServices] = useState(null);
    const [isChange, setIsChange] = useState(false);
    const [filterServices, setFilterServices] = useState([]);

    // Estado para el modal de creación y actualización de información de los servicios
    const [show, setShow] = useState(false);
    const [rowSelect, setRowSelect] = useState(null);

    // Estado para el modal de eliminación de servicios 
    const [typeModal, setTypeModal] = useState('form');

    // Estado para el mensaje de alerta
    const [alert, setAlert] = useState(null);

    // Estado para el modal de carga 
    const [isLoading, setIsLoading] = useState(null);

    useEffect(() => {
        getGeneralTreatmentEdit().then(res => {
            setDataServices(res.data);
            setFilterServices(res.data);
        })
        .catch(err => {
            handleErrorLoading(err);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isChange]);

    useEffect(() => {
        if(filterServices.length > 0 && filterText !== '') filterData();
        
        if(filterServices?.length <= 0 || filterText === '') setFilterServices(dataServices);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText]);


    const filterData = () => {
        const data = dataServices.filter(service => 
            service.name.toString().toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) === true 
        );
        setFilterServices(data);
    }

    // Función que capta los datos que se ingresa en el input y realiza el filtro de la tabla 
    const handleChange = (e) => {
        setFilterText(e.target.value.toString());
        if(filterText === '' || filterServices.length <= 0) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterServices(dataServices);
        }
    }

    // Función que limpia los campos del input y resetea la tabla
    const handleClear = () => {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterServices(dataServices);
        setFilterText('');
    };

    // Funciones para cerrar y mostrar el modal
    const handleClose = () => { 
        setShow(false);
        setRowSelect(null);
    }
    const handleShow = () => setShow(true);

    const create = async(form) => {
        const result = await createTreatment(form);
        if(result.success && result.success === true) setIsChange(!isChange);
            
        setIsLoading({success: result.success});
        setAlert(result);

        return result;
    }

    const edit = async(form, data) => {
        const result = await updateTreatment(form, data.id);
        if(result.success && result.success === true) setIsChange(!isChange);
        
        setIsLoading({success: result.success});
        setAlert(result);

        return result;
    }

    const handleErrorLoading = (err) => {
        if((err.response.status === 0 && err.response.data === undefined) || 
            (err.response.data.success === undefined && (err.response.status === 400 
            || err.response.status === 405 ||
            err.status === 500))) {
            setErrorLoading({success: true, message: 'Error inesperado. Refresque la página o intente más tarde'});
            return;
        }
        setErrorLoading({success: true, message: err.response.data.message});
    }

    const handleErrors = (result) => {
        if(result.success === undefined && (result.status === 0 || result.status === 400 || 
            result.status === 404 || result.status === 405 ||
            result.status === 500)) {
            setAlert({success: false, message: 'Error inesperado. Refresque la página o intente más tarde'});
            setIsLoading({success: false});
        }
    }

    // Función guardar y actualizar datos de los servicios
    const saveService = async (data, reset, type, setError) => {
        // Se elimina espacios innecesarios
        const sanitizedName = data.name.trim();
        const sanitizedDescription = data.description.trim();

        // Se convierte a mayúscula la primer letra
        data.name = sanitizedName.charAt(0).toUpperCase() + sanitizedName.slice(1);
        data.description = sanitizedDescription.charAt(0).toUpperCase() + sanitizedDescription.slice(1);
        data.duration = HoursToMinutes(data.duration);

        let form = new FormData();
        form.append('Name', data.name);
        form.append('Description', data.description);
        form.append('Image', data.imageUrl ? (data.imageUrl[0] === undefined ? null : data.imageUrl[0]) : null);
        form.append('Duration', data.duration);

        let result = null;
        setIsLoading({success: undefined});

        if(type === 'create') result = await create(form);
        else result = await edit(form, data);

        if(result.success === false && result.errors !== null) {
            setError("imageUrl", {
                type: 'custom2',
                message: result.errors.Image[0]
            });
            setAlert(null);
            return;
        }

        handleErrors(result);
        handleClose();
        reset();
        setRowSelect(null);
    }

    const eliminateService = async(data) => {
        setIsLoading({success: undefined});
        const result = await deleteTreatment(data);
        
        if(result.success && result.success === true) setIsChange(!isChange);
        
        setIsLoading({success: result.success});
        setAlert(result);

        handleErrors(result)
        handleClose();
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
                        saveService={saveService}
                        alert={alert}
                        setAlert={setAlert}
                        serviceSelect={rowSelect} /> 
                    ):(
                        <EliminationModal
                        handleClose={handleClose} 
                        show={show}
                        serviceSelect={rowSelect}
                        alert={alert}
                        setAlert={setAlert}
                        eliminateService={eliminateService}
                         /> 
                    )
                ):<></>
            }
            <h1 className={styles.page_title}>Gestión de Servicios</h1>
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
                {errorLoading.success === false && (
                    <FilterComponent 
                    onFilter={handleChange} 
                    onClear={handleClear} 
                    filterText={filterText}
                    setFilterText={setFilterText}
                    inputText="Ingrese servicio a buscar"
                    className={styles.filter} />
                )}
            </div>

            {
                errorLoading.success === false ? (
                    filterServices ? (
                        <GeneralServiceTable 
                            styles="margin-bottom: 40px;" 
                            services={filterServices} 
                            paginationResetDefaultPage={resetPaginationToggle}
                            handleShow={handleShow}
                            setTypeModal={setTypeModal}
                            setServiceSelect={setRowSelect} />
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

export default GeneralServicePage;
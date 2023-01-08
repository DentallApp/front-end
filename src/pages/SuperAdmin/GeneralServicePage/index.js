import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { IoAddCircle } from "react-icons/io5";
import { GeneralServiceTable, FormModal, EliminationModal } from './components';
import { AlertMessage, ModalLoading, FilterComponent } from 'components';
import { createTreatment, getGeneralTreatmentEdit, updateTreatment, deleteTreatment } from 'services/GeneralTreatments';
import { HoursToMinutes } from 'utils/timeUtils';
import { handleErrors, handleErrorLoading } from 'utils/handleErrors';
import styles from './GeneralServicePage.module.css';

const GeneralServicePage = () => {

    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});
    
    // Estados para el filtro
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    // Estado para los datos de la tabla
    const [dataServices, setDataServices] = useState(null);
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
            handleErrorLoading(err, setErrorLoading);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(filterServices?.length > 0 && filterText !== '') filterData();
        
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

    const create = async(form, data) => {
        const result = await createTreatment(form);
        if(result.success && result.success === true) {
            result.message = 'Servicio creado con éxito';
            addNewService(data, parseInt(result.data.id, 10));
            setFilterText('');
        }

        setIsLoading({success: result.success});
        setAlert(result);

        return result;
    }

    const edit = async(form, data) => {
        const result = await updateTreatment(form, data.id);
        if(result.success && result.success === true) {
            result.message = 'Servicio actualizado exitosamente';
            updateLocalData(data);
        }

        setIsLoading({success: result.success});
        setAlert(result);

        return result;
    }

    const addNewService = (data, newServiceId) => {
        const newService = {
            id: newServiceId,
            name: data.name,
            duration: data.duration,
            description: data.description
        }

        setDataServices([
            ...dataServices,
            newService
        ]);

        setFilterServices([
            ...dataServices,
            newService
        ]);
    }

    const updateLocalData = (data) => {

        const updateService = {
            id: parseInt(data.id),
            name: data.name,
            duration: data.duration,
            description: data.description
        }

        setDataServices(dataServices.map(
            service => service.id === updateService.id ? {
                ...updateService
            }: service
        ));

        setFilterServices(filterServices.map(
            service => service.id === updateService.id ? {
                ...updateService
            }: service
        ));
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

        if(type === 'create') result = await create(form, data);
        else result = await edit(form, data);

        if(result.success === false && result.errors !== null) {
            setError("imageUrl", {
                type: 'custom2',
                message: result.errors.Image[0]
            });
            setAlert(null);
            return;
        }

        handleErrors(result, setAlert, setIsLoading);
        handleClose();
        reset();
        setRowSelect(null);
    }

    const eliminateService = async(id) => {
        setIsLoading({success: undefined});
        const result = await deleteTreatment(id);
        
        if(result.success && result.success === true) {
            result.message = 'Servicio eliminado exitosamente';
            setDataServices(dataServices.filter(service => service.id !== id));
            setFilterServices(filterServices.filter(service => service.id !== id));
        }

        setIsLoading({success: result.success});
        setAlert(result);

        handleErrors(result, setAlert, setIsLoading);
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
                        serviceSelect={rowSelect} /> 
                    ):(
                        <EliminationModal
                        handleClose={handleClose} 
                        show={show}
                        serviceSelect={rowSelect}
                        eliminateService={eliminateService}
                         /> 
                    )
                ):<></>
            }
            <h1 className={'page_title'}>Gestión de Servicios</h1>
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
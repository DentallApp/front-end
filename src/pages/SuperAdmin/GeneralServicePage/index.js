import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { IoAddCircle } from "react-icons/io5";
import { GeneralServiceTable, FormModal, EliminationModal } from './components';
import { AlertMessage, ModalLoading, FilterComponent } from '../../../components';
import { createTreatment, getGeneralTreatmentEdit, updateTreatment, deleteTreatment } from '../../../services/GeneralTreatments';
import { HoursToMinutes } from '../../../utils/timeUtils';
import styles from './GeneralServicePage.module.css';

const GeneralServicePage = () => {
    
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
        .catch(err => console.log('Algo ocurrio: ' + err));
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

    // Función guardar y actualizar datos de los servicios
    const saveService = async (data, reset, type) => {
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
        form.append('Image', data.imageUrl[0] === undefined ? null : data.imageUrl[0]);
        form.append('Duration', data.duration);
        
        setIsLoading({success: undefined});

        if(type === 'create') {
            const result = await createTreatment(form);
            if(result.success && result.success === true) setIsChange(!isChange);
            
            setIsLoading({success: result.success});
            setAlert(result);
        }    
        else {
            
            const result = await updateTreatment(form, data.id);
            if(result.success && result.success === true) setIsChange(!isChange);
            
            setIsLoading({success: result.success});
            setAlert(result);
        }

        handleClose();
        reset();
        setRowSelect(null);
    }

    const eliminateService = async(data) => {
        setIsLoading({success: undefined});
        const result = await deleteTreatment(data);
        
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
                <FilterComponent 
                onFilter={handleChange} 
                onClear={handleClear} 
                filterText={filterText}
                setFilterText={setFilterText}
                inputText="Ingrese servicio a buscar"
                className={styles.filter} />
            </div>

            {
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
            }
        </>
    );
}

export default GeneralServicePage;
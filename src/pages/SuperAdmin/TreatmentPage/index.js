import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { IoAddCircle } from "react-icons/io5";
import { TreatmentTable, FormModal, EliminationModal, SelectGeneralService } from './components';
import { AlertMessage, ModalLoading, FilterComponent } from 'components';
import { 
    getSpecificTreatment, 
    createSpecificTreatment, 
    updateSpecificTreatment, 
    deleteSpecificTreatment } from 'services/SpecificTreatmentService';
import { handleErrors, handleErrorLoading } from 'utils/handleErrors';  
import styles from './TreatmentPage.module.css';

const TreatmentPage = () => {
    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});
    const [serviceSelected, setServiceSelected] = useState(null);
    
    // Estados para el filtro
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    // Estado para los datos de la tabla
    const [storeTreatments, setStoreTreatments] = useState(null);
    const [dataTreatments, setDataTreatments] = useState(null);
    const [filterTreatments, setFilterTreatments] = useState([]);

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
        getSpecificTreatment()
        .then(res => {
            setStoreTreatments(res.data);
            setDataTreatments(res.data);
            setFilterTreatments(res.data);
        })
        .catch(err => {
            handleErrorLoading(err, setErrorLoading);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(filterTreatments?.length > 0 && filterText !== '') filterData();
        
        if((filterTreatments?.length <= 0 || filterText === '') && serviceSelected === 0) setFilterTreatments(storeTreatments);

        if((filterTreatments?.length <= 0 || filterText === '') && serviceSelected !== 0) setFilterTreatments(dataTreatments);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText]);


    const filterData = () => {
        const data = dataTreatments.filter(treatment => 
            treatment.specificTreatmentName.toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) === true 
        );
        setFilterTreatments(data);
    }

    // Función que capta los datos que se ingresa en el input y realiza el filtro de la tabla 
    const handleChange = (e) => {
        setFilterText(e.target.value.toString());
        if((filterText === '' || filterTreatments.length <= 0) && serviceSelected === 0) 
            setFilterTreatments(storeTreatments);
        
        if((filterText === '' || filterTreatments.length <= 0) && serviceSelected !== 0)
            setFilterTreatments(dataTreatments)
    }

    // Función que limpia los campos del input y resetea la tabla
    const handleClear = () => {
        setResetPaginationToggle(!resetPaginationToggle);
        if(serviceSelected !== 0) setFilterTreatments(dataTreatments);
        
        if(serviceSelected === 0) setFilterTreatments(storeTreatments);
        
        setFilterText('');
    };

    // Funciones para cerrar y mostrar el modal
    const handleClose = () => { 
        setShow(false);
        setRowSelect(null);
    }
    const handleShow = () => setShow(true);

    const create = async(data) => {
        const result = await createSpecificTreatment(data);
        if(result.success && result.success === true) {
            result.message = 'Tratamiento creado con éxito';
            addNewTreatment(data, parseInt(result.data.id))
            setFilterText('');
            setServiceSelected(0);
        }

        setIsLoading({success: result.success});
        setAlert(result);

        return result;
    }

    const edit = async(data) => {
        data.specificTreatmentId = parseInt(data.specificTreatmentId);

        const result = await updateSpecificTreatment(data);
        if(result.success && result.success === true) {
            result.message = 'Tratamiento actualizado exitosamente';
            updateLocalData(data);
            setFilterText('');
            setServiceSelected(0);
        }

        setIsLoading({success: result.success});
        setAlert(result);

        return result;
    }

    // Función guardar y actualizar datos de los servicios
    const saveTreatment = async (data, reset, type) => {
        // Se elimina espacios innecesarios
        const sanitizedName = data.name.trim();

        // Se convierte a mayúscula la primer letra
        data.name = sanitizedName.charAt(0).toUpperCase() + sanitizedName.slice(1);
        data.price = parseFloat(data.price);

        setIsLoading({success: undefined});
        let result = null;

        if(type === 'create') result = await create(data);
        else result = await edit(data);

        handleErrors(result, setAlert, setIsLoading);
        handleClose();
        reset();
        setRowSelect(null);
    }

    const eliminateService = async(id) => {
        setIsLoading({success: undefined});
        const result = await deleteSpecificTreatment(id);

        if(result.success && result.success === true) {
            result.message = 'Tratamiento eliminado con éxito';
            setStoreTreatments(storeTreatments.filter(treatment => treatment.specificTreatmentId !== id))
            setDataTreatments(dataTreatments.filter(treatment => treatment.specificTreatmentId !== id));
            setFilterTreatments(filterTreatments.filter(treatment => treatment.specificTreatmentId !== id));
            setFilterText('');
            setServiceSelected(0);
        }

        setIsLoading({success: result.success});
        setAlert(result);
        handleErrors(result);
        
        handleClose();
        setRowSelect(null);
    }

    const addNewTreatment = (data, newTreatmentId) => {
        data.specificTreatmentName = data.name;
        data.specificTreatmentId = newTreatmentId;

        setStoreTreatments([...storeTreatments, data]);
        setDataTreatments([...storeTreatments, data]);
        setFilterTreatments([...storeTreatments, data]);
    }

    const updateLocalData = (data) => {
        data.specificTreatmentId = parseInt(data.specificTreatmentId);
        data.specificTreatmentName = data.name;

        setStoreTreatments(storeTreatments.map(treatment => 
            treatment.specificTreatmentId === data.specificTreatmentId ? {
                ...data
            } : treatment));
        
        setDataTreatments(storeTreatments.map(treatment => 
            treatment.specificTreatmentId === data.specificTreatmentId ? {
                ...data
            } : treatment));
            
        setFilterTreatments(storeTreatments.map(treatment => 
            treatment.specificTreatmentId === data.specificTreatmentId ? {
                ...data
            } : treatment));
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
                        saveTreatment={saveTreatment}
                        specificTreatmentSelect={rowSelect} /> 
                    ):(
                        <EliminationModal
                        handleClose={handleClose} 
                        show={show}
                        specificTreatmentSelect={rowSelect}
                        eliminateService={eliminateService}
                         /> 
                    )
                ):<></>
            }
            <h1 className={'page_title'}>Gestión de Tratamientos</h1>
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

            { errorLoading.success === false && (
                <>
                    <SelectGeneralService
                    storeTreatments={storeTreatments} 
                    setFilterTreatments={setFilterTreatments}
                    serviceSelected={serviceSelected}
                    setServiceSelected={setServiceSelected}
                    setDataTreatments={setDataTreatments} />

                    <FilterComponent 
                    onFilter={handleChange} 
                    onClear={handleClear} 
                    filterText={filterText}
                    setFilterText={setFilterText}
                    inputText="Ingrese tratamiento a buscar"
                    className={styles.filter} />
                </>
            )}
            </div>

            <Button 
                className={styles.button_add} 
                onClick={() => {
                    setTypeModal('form');
                    handleShow();
                }}> 
                    <IoAddCircle className={styles.icon} /> Nuevo
            </Button>

            {
                errorLoading.success === false ? (
                    filterTreatments ? (
                        <TreatmentTable 
                            styles="margin-bottom: 40px;" 
                            services={filterTreatments} 
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

export default TreatmentPage;
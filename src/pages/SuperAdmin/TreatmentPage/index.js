import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { IoAddCircle } from "react-icons/io5";
import { TreatmentTable, FormModal, EliminationModal, SelectGeneralService } from './components';
import { AlertMessage, ModalLoading, FilterComponent } from '../../../components';
import { 
    getSpecificTreatment, 
    createSpecificTreatment, 
    updateSpecificTreatment, 
    deleteSpecificTreatment } from '../../../services/SpecificTreatmentService';
import { UNEXPECTED_ERROR } from '../../../constants/InformationMessage';    
import styles from './TreatmentPage.module.css';

const TreatmentPage = () => {
    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});
    const [valueSelected, setValueSelected] = useState(null);
    
    // Estados para el filtro
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    // Estado para los datos de la tabla
    const [dataTreatments, setDataTreatments] = useState(null);
    const [isChange, setIsChange] = useState(false);
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
            setDataTreatments(res.data);
            setFilterTreatments(res.data);
        })
        .catch(err => {
            handleErrorLoading(err);
        });
        
    }, [isChange]);

    useEffect(() => {
        if(filterTreatments.length > 0 && filterText !== '') filterData();
        
        if(filterTreatments?.length <= 0 || filterText === '') setFilterTreatments(dataTreatments);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText]);


    const filterData = () => {
        const data = dataTreatments.filter(treatment => 
            treatment.specificTreatmentName.toString().toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) === true 
        );
        setFilterTreatments(data);
    }

    // Función que capta los datos que se ingresa en el input y realiza el filtro de la tabla 
    const handleChange = (e) => {
        setFilterText(e.target.value.toString());
        if(filterText === '' || filterTreatments.length <= 0) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterTreatments(dataTreatments);
        }
    }

    // Función que limpia los campos del input y resetea la tabla
    const handleClear = () => {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterTreatments(dataTreatments);
        setFilterText('');
    };

    // Funciones para cerrar y mostrar el modal
    const handleClose = () => { 
        setShow(false);
        setRowSelect(null);
        setValueSelected(0);
    }
    const handleShow = () => setShow(true);

    const create = async(data) => {
        const result = await createSpecificTreatment(data);
        if(result.success && result.success === true) setIsChange(!isChange);
        
        setIsLoading({success: result.success});
        setAlert(result);

        return result;
    }

    const edit = async(data) => {
        const result = await updateSpecificTreatment(data);
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
            setErrorLoading({success: true, message: UNEXPECTED_ERROR});
            return;
        }
        setErrorLoading({success: true, message: err.response.data.message});
    }
    
    const handleErrors = (result) => {
        if(result.success === undefined && (result.status === 0 || result.status === 400 || 
            result.status === 404 || result.status === 405 ||
            result.status === 500)) {
            setAlert({success: false, message: UNEXPECTED_ERROR});
            setIsLoading({success: false});
        }
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

        handleErrors(result);
        handleClose();
        reset();
        setRowSelect(null);
    }

    const eliminateService = async(data) => {
        setIsLoading({success: undefined});
        const result = await deleteSpecificTreatment(data);

        if(result.success && result.success === true) setIsChange(!isChange);
        
        setIsLoading({success: result.success});
        setAlert(result);
        handleErrors(result);
        
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
            <h1 className={styles.page_title}>Gestión de Tratamientos</h1>
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
                    dataTreatments={dataTreatments} 
                    setFilterTreatments={setFilterTreatments}
                    valueSelected={valueSelected}
                    setValueSelected={setValueSelected} />

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
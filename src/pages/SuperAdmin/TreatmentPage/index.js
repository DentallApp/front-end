import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { IoAddCircle } from "react-icons/io5";
import { TreatmentTable, FormModal, EliminationModal } from './components';
import { AlertMessage, ModalLoading, FilterComponent } from '../../../components';
import { createTreatment, getGeneralTreatmentEdit, updateTreatment, deleteTreatment } from '../../../services/GeneralTreatments';
import data from './data';
import styles from './TreatmentPage.module.css';

const TreatmentPage = () => {
    
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
        setDataTreatments(data);
        setFilterTreatments(data);
    }, [isChange]);

    useEffect(() => {
        if(filterTreatments.length > 0 && filterText !== '') filterData();
        
        if(filterTreatments?.length <= 0 || filterText === '') setFilterTreatments(data);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText]);


    const filterData = () => {
        const data = dataTreatments.filter(treatment => 
            treatment.name.toString().toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) === true 
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
    }
    const handleShow = () => setShow(true);

    // Función guardar y actualizar datos de los servicios
    const saveTreatment = async (data, reset, type) => {
        // Se elimina espacios innecesarios
        const sanitizedName = data.name.trim();

        // Se convierte a mayúscula la primer letra
        data.name = sanitizedName.charAt(0).toUpperCase() + sanitizedName.slice(1);
        data.price = parseFloat(data.price);

        //setIsLoading({success: undefined});

        if(type === 'create') {
            //const result = await createTreatment(data);
            //if(result.success && result.success === true) setIsChange(!isChange);
            console.log(data);
            //setIsLoading({success: result.success});
            //setAlert(result);
        }    
        else {
            
            //const result = await updateTreatment(data);
            //if(result.success && result.success === true) setIsChange(!isChange);
            
            //setIsLoading({success: result.success});
            //setAlert(result);
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
                        saveTreatment={saveTreatment}
                        alert={alert}
                        setAlert={setAlert}
                        treatmentSelect={rowSelect} /> 
                    ):(
                        <EliminationModal
                        handleClose={handleClose} 
                        show={show}
                        treatmentSelect={rowSelect}
                        alert={alert}
                        setAlert={setAlert}
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
            }
        </>
    );
}

export default TreatmentPage;
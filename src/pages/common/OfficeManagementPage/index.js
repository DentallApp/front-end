import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { IoAddCircle } from "react-icons/io5";
import { AlertMessage, ModalLoading, FilterComponent } from '../../../components';
import { OfficeTable, FormModal } from './components';
import data from './data';
import styles from './OfficeManagementPage.module.css';

const OfficeManagementPage = () => {
    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});
    // Estados para el filtro
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    // Estado para los datos de la tabla
    const [dataOffices, setDataOffices] = useState(null);
    const [isChange, setIsChange] = useState(false);
    const [filterOffices, setFilterOffices] = useState([]);

    // Estado para el modal de creación y actualización de información de usuarios
    const [show, setShow] = useState(false);
    const [rowSelect, setRowSelect] = useState(null);

    // Estado para el mensaje de alerta
    const [alert, setAlert] = useState(null);

    // Estado para el modal de carga 
    const [isLoading, setIsLoading] = useState(null);

    useEffect(() => {
        setDataOffices(data);
        setFilterOffices(data);
    }, [isChange]);
     
    useEffect(() => {
        if(filterOffices?.length > 0 && filterText !== '') filterData();
        
        if(filterOffices?.length <= 0 || filterText === '') setFilterOffices(data);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText]);

    const filterData = () => {
        const data = dataOffices.filter(office => 
            office.officeName.toString().toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) === true 
           
        );
        setFilterOffices(data);
    }

    // Función que capta los datos que se ingresa en el input y realiza el filtro de la tabla 
    const handleChange = (e) => {
        setFilterText(e.target.value.toString());
        if(filterText === '' || filterOffices.length <= 0) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterOffices(dataOffices);
        }
    }

    // Función que limpia los campos del input y resetea la tabla
    const handleClear = () => {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterOffices(dataOffices);
        setFilterText('');
    };

    // Funciones para cerrar y mostrar el modal
    const handleClose = () => { 
        setShow(false);
        setRowSelect(null);
    }
    const handleShow = () => setShow(true);

    const saveOffice = (data, reset, type) => {
        console.log(data);

        handleClose();
        reset();
        setRowSelect(null);
    }

    return (
        <>
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
            <h1 className={styles.page_title}>Gestión de Consultorios</h1>

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
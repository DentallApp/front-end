import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import moment from 'moment';
import { IoAddCircle } from "react-icons/io5";
import { AlertMessage, ModalLoading, FilterComponent } from 'components';
import { DependentTable, FormModal, EliminationModal } from './components';
import { trimSpaces, capitalizeFirstLetter } from 'utils/stringUtils';
import { 
    getDependents, 
    createDependent, 
    updateDependent, 
    deleteDependent } from 'services/DependentService';
import { getGenders } from 'services/GenderService';
import { getKinship } from 'services/KinshipService';
import { handleErrors, handleErrorLoading } from 'utils/handleErrors';
import { verifyIdentityDocument } from 'utils/validationIdentityDocument';
import styles from './DependentPage.module.css';

const DependentPage = () => {

    const [genders, setGenders] = useState(null); // Estado para los géneros
    const [kinship, setKinship] = useState(null); // Estado para el parentesco

    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});

    // Estados para el filtro
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    // Estado para los datos de la tabla
    const [dataDependents, setDataDependents] = useState(null);
    const [filterDependents, setFilterDependents] = useState([]);

    // Estado para el modal de creación y actualización de información de dependientes
    const [show, setShow] = useState(false);
    const [dependentSelect, setDependentSelect] = useState(null);

    // Estado para el modal de eliminación de dependientes 
    const [typeModal, setTypeModal] = useState('form');

    // Estado para el mensaje de alerta
    const [alert, setAlert] = useState(null);

    // Estado para el modal de carga 
    const [isLoading, setIsLoading] = useState(null);

    useEffect(() => {
        getDependents()
        .then(res => {
            setDataDependents(res.data);
            setFilterDependents(res.data);
        })
        .catch(err => {
            handleErrorLoading(err, setErrorLoading);
        });

        getGenders().then(response => setGenders(response.data))
            .catch(error => console.error(error));

        getKinship().then(response => setKinship(response.data))
            .catch(error => console.log(error));

        // eslint-disable-next-line react-hooks/exhaustive-deps    
    }, []);
     
    useEffect(() => {
        if(filterDependents?.length > 0 && filterText !== '') filterData();
       
        if(filterDependents?.length <= 0 || filterText === '') setFilterDependents(dataDependents);
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [filterText]);

    const filterData = () => {
        const data = dataDependents.filter(dependent => 
            dependent.document.toString().includes(filterText.toLocaleLowerCase()) === true || 
                dependent.names.toString().toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) === true ||
                dependent.lastNames.toString().toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) === true 
        );
        setFilterDependents(data);
    }

    // Función que capta los datos que se ingresa en el input y realiza el filtro de la tabla 
    const handleChange = (e) => {
        setFilterText(e.target.value.toString());
        if(filterText === '' || filterDependents.length <= 0) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterDependents(dataDependents);
        }
    }

    // Función que limpia los campos del input y resetea la tabla
    const handleClear = () => {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterDependents(dataDependents);
        setFilterText('');
    };

    // Funciones para cerrar y mostrar el modal
    const handleClose = () => { 
        setShow(false);
        setDependentSelect(null);
    }
    const handleShow = () => setShow(true);

    const create = async(data) => {
        const result = await createDependent(data);
        if(result.success && result.success === true) {
            result.message = 'Dependiente creado exitosamente';
            addNewLocalData(data, parseInt(result.data.id));
            setFilterText('');
        }    

        setIsLoading({success: result.success});
        setAlert(result);

        return result;
    }

    const edit = async(data) => {
        const result = await updateDependent(data);
        if(result.success && result.success === true) {
            result.message = 'Dependiente actualizado exitosamente';
            updateLocalData(data);
        }    
            
        setIsLoading({success: result.success});
        setAlert(result);

        return result;
    }

    // Función guardar y actualizar datos de los dependientes
    const saveDependent = async (data, reset, type, setError) => {

        const verifyDocument = verifyIdentityDocument(data.document);

        if(verifyDocument === false) {
            setError("document", {
                type: 'custom',
                message: 'Cedula de identidad no válida'
            });
            return;
        }

        // Se elimina espacios innecesarios
        const sanitizedName = trimSpaces(data.names);
        const sanitizedLastName = trimSpaces(data.lastNames);

        // Se convierte a mayúscula la primer letra de cada palabra
        data.names = capitalizeFirstLetter(sanitizedName);
        data.lastNames = capitalizeFirstLetter(sanitizedLastName);
        data.genderId = parseInt(data.genderId);
        data.kinshipId = parseInt(data.kinshipId);

        setIsLoading({success: undefined});
        let result = null;

        if(type === 'create') result = await create(data);   
        else {
            data.dependentId = dependentSelect.dependentId;
            result = await edit(data);
        }

        handleErrors(result, setAlert, setIsLoading);
        handleClose();
        reset();
        setDependentSelect(null);
    }

    const eliminateDependent = async(id) => {
        setIsLoading({success: undefined});
        const result = await deleteDependent(id);
        
        if(result.success && result.success === true) {
            result.message = 'Dependiente eliminado con éxito';
            setDataDependents(dataDependents.filter(dependent => dependent.dependentId !== id));
            setFilterDependents(filterDependents.filter(dependent => dependent.dependentId !== id));
        }

        setIsLoading({success: result.success});
        setAlert(result);
        
        handleErrors(result, setAlert, setIsLoading);
        handleClose();
        setDependentSelect(null);
    }

    const addNewLocalData = (data, newDependentId) => {

        const newDependent = {
            dependentId: newDependentId,
            cellPhone: data.cellPhone,
            names: data.names,
            lastNames: data.lastNames,
            fullName: data.names + ' ' + data.lastNames,
            dateBirth: moment(data.dateBirth).format('DD/MM/YYYY'),
            document: data.document,
            email: data.email,
            genderId: data.genderId,
            genderName: genders.filter(gender => gender.id === data.genderId)[0].name,
            kinshipId: data.kinshipId,
            kinshipName: kinship.filter(k => k.id === data.kinshipId)[0].name
        }

        setDataDependents([
            ...dataDependents, 
            newDependent
        ]);
        
        setFilterDependents([
            ...dataDependents,
            newDependent
        ]);
    }

    const updateLocalData = (data) => {

        data.fullName = data.names + ' ' + data.lastNames;
        data.genderName = genders.filter(gender => gender.id === data.genderId)[0].name;
        data.kinshipName = kinship.filter(k => k.id === data.kinshipId)[0].name;

        setDataDependents(
            dataDependents.map(
                dependent => dependent.dependentId === data.dependentId ? {
                    ...data
                }:
                dependent
            )
        );

        setFilterDependents(
            filterDependents.map(
                dependent => dependent.dependentId === data.dependentId ? {
                    ...data
                }:
                dependent
            )
        );
        
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
                        genders={genders}
                        kinship={kinship} 
                        saveDependent={saveDependent}
                        dependentSelect={dependentSelect} /> 
                    ):(
                        <EliminationModal
                        handleClose={handleClose} 
                        show={show}
                        dependentSelect={dependentSelect}
                        eliminateDependent={eliminateDependent}
                         />
                    )
                ):<></>
            }
            <h1 className={'page_title'}>Gestión de Dependientes</h1>
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
                { errorLoading.success === false && (
                    <FilterComponent 
                    onFilter={handleChange} 
                    onClear={handleClear} 
                    filterText={filterText}
                    setFilterText={setFilterText}
                    inputText="Ingrese nombre o cedula a buscar"
                    className={styles.filter} />
                )}
            </div>
            {
                errorLoading.success === false ? (
                    filterDependents ? (
                        <DependentTable 
                            styles="margin-bottom: 40px;" 
                            dependents={filterDependents} 
                            paginationResetDefaultPage={resetPaginationToggle}
                            handleShow={handleShow}
                            setTypeModal={setTypeModal}
                            setDependentSelect={setDependentSelect} />
                    ): 
                    (
                        <div className={`${styles.container_spinner}`}>
                            <Spinner size="lg" className={styles.spinner} animation="border" variant="info" />
                            <p className={styles.text_loading}>Cargando...</p>
                        </div>
                    )
                )
                :(
                    <h4 className={styles.text_error}>
                        {errorLoading.message}
                    </h4>
                )
            }
        </>
    );
}

export default DependentPage;
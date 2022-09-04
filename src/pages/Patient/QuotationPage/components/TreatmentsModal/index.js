import { useState, useEffect } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { useWindowWidth } from '@react-hook/window-size';
import TreatmentsTable from '../TreatmentsTable';
import { FilterComponent } from 'components';
import styles from './TreatmentsModal.module.css'
import FilterGeneralService from '../FilterGeneralService';

const TreatmentsModal = ({
    show, 
    handleClose, 
    treatments, 
    selectedTreatments, 
    setSelectedTreatments, 
    errorLoading}) => { 
    
    const [selectedGeneralTreatments, setSelectedGeneralTreatments] = useState(null);    
    const [dataTreatments, setDataTreatments] = useState([]);
    const [filterTreatments, setFilterTreatments] = useState(null);
    // Estados para el filtro
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    
    const [valueSelected, setValueSelected] = useState(null);
    const [selectedSpecificTreatments, setSelectedSpecificTreatments] = useState([]);
    const onlyWidth = useWindowWidth(); // Se obtiene ancho y altura de pantalla para colocar el modal

    useEffect(() => {
        if(selectedTreatments.length > 0) {
            setDataTreatments(treatments.filter(
                treatment => !selectedTreatments.some(selected => 
                        treatment.specificTreatmentId === selected.specificTreatmentId
            )));
        }
        else {
            setDataTreatments(treatments);
        }
        setFilterTreatments(dataTreatments);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [treatments]);

    useEffect(() => {
        if(valueSelected === 0) setFilterTreatments(dataTreatments);
        if(valueSelected !== 0) setFilterTreatments(selectedGeneralTreatments);
        //setFilterTreatments(dataTreatments);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataTreatments]);

    useEffect(() => {
        if(filterTreatments?.length > 0 && filterText !== '') filterData();
        
        if((filterTreatments?.length <= 0 || filterText === '') && valueSelected === 0) 
            setFilterTreatments(dataTreatments);
        if((filterTreatments?.length <= 0 || filterText === '') && valueSelected !== 0) 
            setFilterTreatments(selectedGeneralTreatments);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText]);

    const filterData = () => {
        let data = null;

        if(valueSelected === 0)
            data = dataTreatments.filter(treatment => 
                treatment.specificTreatmentId.toString().includes(filterText.toLocaleLowerCase()) === true || 
                treatment.specificTreatmentName.toString().toLocaleLowerCase()
                .includes(filterText.toLocaleLowerCase()) === true 
            );
        else 
            data = selectedGeneralTreatments.filter(treatment => 
                treatment.specificTreatmentId.toString().includes(filterText.toLocaleLowerCase()) === true || 
                treatment.specificTreatmentName.toString().toLocaleLowerCase()
                .includes(filterText.toLocaleLowerCase()) === true 
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
        if(valueSelected === 0) setFilterTreatments(dataTreatments);
        else setFilterTreatments(selectedGeneralTreatments);
        setFilterText('');
    };

    return (
        <Modal 
        show={show}
        onHide={handleClose} 
        dialogClassName={styles.container_modal}
        aria-labelledby="example-custom-modal-styling-title"
        fullscreen={ onlyWidth < 768 ? true : false} 
        >
            <Modal.Header className={styles.container_header} closeButton>
                <Modal.Title> Cotizaciones </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h2>Tratamientos Dentales</h2>
                <div className="underline mx-auto"></div>
                <p className={styles.text_information}>Seleccione los tratamientos que desee cotizar</p>

                <div className={styles.container_filters}>
                    { errorLoading.success === false && (
                        <>
                            <FilterGeneralService 
                            dataTreatments={dataTreatments}
                            setFilterTreatments={setFilterTreatments}
                            valueSelected={valueSelected}
                            setValueSelected={setValueSelected}
                            setSelectedGeneralTreatments={setSelectedGeneralTreatments}/>
                            
                            <FilterComponent 
                            onFilter={handleChange} 
                            onClear={handleClear} 
                            filterText={filterText}
                            setFilterText={setFilterText}
                            inputText="Escriba el tratamiento a buscar"
                            fullWidth={true} 
                            className={styles.filter_component} />
                        </>
                    )}
                </div>
                
                {
                    errorLoading.success === false ?(
                        filterTreatments ? (
                            <TreatmentsTable
                            treatments={filterTreatments} 
                            paginationResetDefaultPage={resetPaginationToggle}
                            setSelected={setSelectedSpecificTreatments} />
                        ):
                        <div className={`${styles.container_spinner}`}>
                            <Spinner size="lg" className={styles.spinner} animation="border" variant="info" />
                            <p className={styles.text_loading}>Cargando...</p>
                        </div>
                    )
                    :(
                        <h5 className={styles.text_error}>
                            {errorLoading.message}
                        </h5>
                    )
                }
                
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button 
                variant="primary"
                onClick={() => {
                    setSelectedTreatments([...selectedTreatments ,...selectedSpecificTreatments]);
                    handleClose();
                }}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default TreatmentsModal;
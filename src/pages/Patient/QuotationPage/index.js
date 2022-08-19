import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { IoAddCircle } from "react-icons/io5";
import { FaDownload } from "react-icons/fa";
import { SelectedTreamentsTable, TreatmentsModal } from './components';
import { getSpecificTreatment } from '../../../services/SpecificTreatmentService';
import styles from './QuotationPage.module.css';

const QuotationPage = () => {

    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});
    const [treatments, setTreatments] = useState(null);
    const [selectedTreatments, setSelectedTreatments] = useState([]);
    const [show, setShow] = useState(false); // Estado para el modal
    const [total, setTotal] = useState(0); 
    
    useEffect(() => {
        getSpecificTreatment()
        .then(res => {
            setTreatments(res.data);
        })
        .catch(err => {
            if((err.response.status === 0 && err.response.data === undefined) || 
                (err.response.data.success === undefined && (err.response.status === 400 
                || err.response.status === 405 ||
                err.status === 500))) {
                setErrorLoading({success: true, message: 'Error inesperado. Refresque la página o intente más tarde'});
            }
        });
    }, []);

    useEffect(() => {
        if(selectedTreatments.length > 0) {
            const initialValue = 0;
            const result = selectedTreatments.reduce(
                (previusValue, currentValue) => previusValue + currentValue.price, initialValue
            );
            setTotal(result); 
        }
    }, [selectedTreatments]);

    // Funciones para cerrar y mostrar el modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const deleteSelected = (row) => {
        const result = selectedTreatments.filter(treatment => treatment.specificTreatmentId !== row.specificTreatmentId);
        setSelectedTreatments(result);
    }

    return (
        <>
            { 
                show === true ? 
                <TreatmentsModal 
                show ={show} 
                handleClose={handleClose}
                treatments={treatments}
                errorLoading={errorLoading} 
                selectedTreatments={selectedTreatments}
                setSelectedTreatments={setSelectedTreatments} /> 
                : 
                null
            }
            <h1 className={styles.page_title}>Cotizaciones</h1>
            <p className={styles.text_information}>Atención: Los tratamientos que se muestran a elegir son indicados por el odontólogo en la consulta</p>
            <div className={styles.container_header}>
                <Button 
                className={styles.button_add} 
                onClick={() => handleShow()}
                > 
                    <IoAddCircle className={styles.icon} /> Añadir
                </Button>
                
                <Button 
                className={styles.button_download} 
                //onClick={() => {}}
                > 
                    <FaDownload className={styles.icon} /> Descargar cotización
                </Button>
            </div>

            { 
                selectedTreatments !== null ? (
                    <SelectedTreamentsTable 
                    styles="margin-bottom: 40px;" 
                    selectedTreatments={selectedTreatments}
                    deleteSelected={deleteSelected} />
                ):
                (
                    <p className={styles.text_information}>
                        No ha agregado tratamientos a su cotización
                    </p>
                ) 
            }
            <h4 className={styles.total}>{selectedTreatments.length > 0 && `TOTAL: $ ${total}`}</h4>
        </>
    );
}

export default QuotationPage;
import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { IoAddCircle } from "react-icons/io5";
import { FaDownload } from "react-icons/fa";
import { SelectedTreamentsTable, TreatmentsModal } from './components';
import data from './data';
import styles from './QuotationPage.module.css';

const QuotationPage = () => {

    const [treatments, setTreatments] = useState(null);
    const [selectedTreatments, setSelectedTreatments] = useState([]);
    const [show, setShow] = useState(false); // Estado para el modal
    const [total, setTotal] = useState(0); 
    
    useEffect(() => {
        setTreatments(data);
        /*setSelectedTreatments(data);*/
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
    const handleClose = () => { 
        setShow(false);
    }
    
    const handleShow = () => setShow(true);

    const deleteSelected = (row) => {
        const result = selectedTreatments.filter(treatment => treatment.id !== row.id);
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
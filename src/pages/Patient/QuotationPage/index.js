import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { IoAddCircle } from "react-icons/io5";
import { FaDownload } from "react-icons/fa";
import { SelectedTreamentsTable, TreatmentsModal } from './components';
import styles from './QuotationPage.module.css';

const data = [
    {id: 1, name: 'Tratamiento 1', price: 20},
    {id: 2, name: 'Tratamiento 2', price: 40},
    {id: 3, name: 'Tratamiento 3', price: 10},
    {id: 4, name: 'Tratamiento 4', price: 15},
    {id: 5, name: 'Tratamiento 5', price: 17},
    {id: 6, name: 'Tratamiento 6', price: 20},
    {id: 7, name: 'Tratamiento 7', price: 10},
    {id: 8, name: 'Tratamiento 8', price: 5},
    {id: 9, name: 'Tratamiento 9', price: 10},
    {id: 10, name: 'Tratamiento 10', price: 25},
    {id: 11, name: 'Tratamiento 11', price: 45},
    {id: 12, name: 'Tratamiento 12', price: 56},
    {id: 13, name: 'Tratamiento 13', price: 80},
    {id: 14, name: 'Tratamiento 14', price: 100},
    {id: 15, name: 'Tratamiento 15', price: 75},
    {id: 16, name: 'Tratamiento 16', price: 55},
    {id: 17, name: 'Tratamiento 17', price: 33},
]

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
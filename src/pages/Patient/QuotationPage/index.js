import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import { IoAddCircle } from "react-icons/io5";
import { FaDownload } from "react-icons/fa";
import { AlertMessage, ModalLoading } from 'components';
import { SelectedTreamentsTable, TreatmentsModal } from './components';
import { getSpecificTreatment } from 'services/SpecificTreatmentService';
import { getLocalUser } from 'services/UserService';
import { downloadQuotationPDF } from 'services/QuotationService';
import { handleErrors, handleErrorLoading } from 'utils/handleErrors';
import styles from './QuotationPage.module.css';

const QuotationPage = () => {

    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});
    const [treatments, setTreatments] = useState(null);
    const [selectedTreatments, setSelectedTreatments] = useState([]);
    const [show, setShow] = useState(false); // Estado para el modal
    const [total, setTotal] = useState(0);
    
     // Estado para el mensaje de alerta
     const [alert, setAlert] = useState(null);

     // Estado para el modal de carga 
     const [isLoading, setIsLoading] = useState(null);
    
    useEffect(() => {
        getSpecificTreatment()
        .then(res => {
            setTreatments(res.data);
        })
        .catch(err => {
            handleErrorLoading(err, setErrorLoading);
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

    const downloadPDF = async() => {
        setIsLoading({status: undefined});
        const user = getLocalUser();
        const data = {
            fullName: user.fullName,
            document: user.document,
            dateIssue: new Date(),
            totalPrice: total,
            dentalTreatments: selectedTreatments
        };

        const result = await downloadQuotationPDF(data);
        setIsLoading({status: result.status});

        if(result.status === 200) {
            const blob = new Blob([result.data], { type: 'application/pdf' });
            saveAs(blob, "cotizacion-tratamientos-dentales.pdf");
        }

        handleErrors(result, setAlert, setIsLoading);
    }

    return (
        <>
            { isLoading ? (isLoading.status === undefined ? <ModalLoading show={true} /> : "") : ""}
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
            <h1 className={'page_title'}>Cotizaciones</h1>
            <div className="underline mx-auto"></div>
            <p className={styles.text_information}>Atención: Los tratamientos que se muestran a elegir son indicados por el odontólogo en la consulta</p>
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
                onClick={() => handleShow()}
                > 
                    <IoAddCircle className={styles.icon} /> Añadir
                </Button>
                
                <Button 
                className={styles.button_download} 
                disabled={selectedTreatments.length === 0 ? true : false}
                onClick={() => downloadPDF()}
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
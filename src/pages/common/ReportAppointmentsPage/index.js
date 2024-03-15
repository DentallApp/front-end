import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FaDownload } from "react-icons/fa";
import { saveAs } from 'file-saver';
import { AppointmentsTable, Filters } from './components';
import { getOfficesActiveAndInactive } from 'services/OfficeService';
import { AlertMessage, ModalLoading } from 'components';
import { handleErrors, handleErrorLoading } from 'utils/handleErrors';
import { getLocalUser } from 'services/UserService';
import ROLES from 'constants/Roles';
import { getReportAppointments } from 'services/ReportsService';
import { downloadReportAppointment } from 'services/DownloadReportService';
import styles from './ReportAppointmentsPage.module.css';

const ReportAppointmentsPage = () => {

    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});

    const [offices, setOffices] = useState(null);
    const [appointments, setAppointments] = useState(null);
    const [selectOffice, setSelectOffice] = useState(null);
    const [selectDentist, setSelectDentist] = useState(null);

    // Estado para el modal de carga 
    const [isLoading, setIsLoading] = useState(null);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Estado para el mensaje de alerta
    const [alert, setAlert] = useState(null);

    useEffect(() => {

        if(getLocalUser().roles.includes(ROLES.SUPERADMIN)) {
            getOfficesActiveAndInactive()
            .then(res => setOffices(res.data))
            .catch(err => handleErrorLoading(err, setErrorLoading));
        }    
    }, []);

    const searchAppointments = (data, setError) => {
        if(data.to < data.from) {
            setError('to', {
                type: 'custom',
                message: 'La fecha final no puede ser menor a la de inicio'
            });
            return;
        }

        setIsLoading({success: undefined});
        data.officeId = parseInt(data.officeId);
        data.dentistId = parseInt(data.dentistId);

        getReportAppointments(data).then(res => {
            setAppointments(res.data.data);
            setIsLoading({success: true});
        })
        .catch(err => handleErrorLoading(err, setErrorLoading));
    }

    const downloadPDF = async() => {
        setIsLoading({success: undefined});
        
        const data = {
            from: startDate,
            to: endDate,
            officeName: selectOffice.label,
            dentistName: selectDentist.label,
            totals: appointments
        };

        const result = await downloadReportAppointment(data);
        setIsLoading({success: result.status});

        if(result.status === 200) {
            const blob = new Blob([result.data], { type: 'application/pdf' });
            saveAs(blob, "reporte-de-citas.pdf");

            setAlert({succes: true, message: 'Reporte descargado con éxito'});
        }

        handleErrors(result, setAlert, setIsLoading);
    }

    return (
        <>
            { isLoading ? (isLoading.success === undefined ? <ModalLoading show={true} /> : "") : ""}
            <h1 className={'page_title'}>Citas asistidas, no asistidas y canceladas</h1>
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

            {
                getLocalUser().roles.includes(ROLES.SUPERADMIN) === false && (
                    <p className={styles.office_current}>
                        <span style={{"fontWeight":"bold"}}>Consultorio actual: </span> 
                        {getLocalUser()?.officeName}
                    </p>
                )
            }

            <div className={styles.container_filters}>
                <Filters
                offices={offices}
                searchAppointments={searchAppointments}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setSelectOffice={setSelectOffice}
                setSelectDentist={setSelectDentist}
                />
            </div>

            <div className={`${styles.container} mb-2`}>
                <Button 
                className={styles.button_download} 
                disabled={appointments !== null ? false : true}
                onClick={() => downloadPDF()}
                > 
                    <FaDownload className={styles.icon} /> PDF
                </Button>        
            </div>

            {
                errorLoading.success === false ? (
                    appointments ? (
                        <AppointmentsTable 
                        appointmentReport={appointments}
                        />
                    ):(
                        <h5 className={styles.no_data}>No hay datos para mostrar</h5>
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

export default ReportAppointmentsPage;
import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FaDownload } from "react-icons/fa";
import { saveAs } from 'file-saver';
import { ServiceTable, Filters } from './components';
import { getOfficesActiveAndInactive } from 'services/OfficeService';
import { AlertMessage, ModalLoading } from 'components';
import { handleErrors, handleErrorLoading } from 'utils/handleErrors';
import { getLocalUser } from 'services/UserService';
import ROLES from 'constants/Roles';
import { getRankingDentalService } from 'services/ReportsService';
import { downloadReportMostRequestServices } from 'services/DownloadReportService';
import styles from './ReportDentalService.module.css';

const ReportDentalService = () => {

    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});

    const [offices, setOffices] = useState(null);
    const [services, setServices] = useState([]);
    
    // Estados para el filtro
    const [filterServices, setFilterServices] = useState(null);

    // Estado para el modal de carga 
    const [isLoading, setIsLoading] = useState(null);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectOffice, setSelectOffice] = useState(null);

    // Estado para el mensaje de alerta
    const [alert, setAlert] = useState(null);

    useEffect(() => {

        if(getLocalUser().roles.includes(ROLES.SUPERADMIN)) {
            getOfficesActiveAndInactive()
            .then(res => setOffices(res.data))
            .catch(err => handleErrorLoading(err, setErrorLoading));
        }
        
        setFilterServices(services);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const searchServices = (data, setError) => {
        if(data.to < data.from) {
            setError('to', {
                type: 'custom',
                message: 'La fecha final no puede ser menor a la de inicio'
            });

            return;
        }

        setIsLoading({success: undefined});
        data.officeId = parseInt(data.officeId);

        getRankingDentalService(data).then(res => {
            setServices(res.data.data);
            setFilterServices(res.data.data);
            setIsLoading({success: true});
        })
        .catch(err => handleErrorLoading(err, setErrorLoading));
    }

    const downloadPDF = async() => {
        setIsLoading({success: undefined});
        
        const data = {
            from: startDate,
            to: endDate,
            officeName: selectOffice,
            services: filterServices
        };

        const result = await downloadReportMostRequestServices(data);
        setIsLoading({success: result.status});

        if(result.status === 200) {
            const blob = new Blob([result.data], { type: 'application/pdf' });
            saveAs(blob, "reporte-de-servicios-mas-solicitados.pdf");

            setAlert({succes: true, message: 'Reporte descargado con éxito'});
        }

        handleErrors(result, setAlert, setIsLoading);
    }

    return (
        <>
            { isLoading ? (isLoading.success === undefined ? <ModalLoading show={true} /> : "") : ""}
            <h1 className={'page_title'}>Reporte de servicios dentales más solicitados</h1>
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
                searchServices={searchServices}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setSelectOffice={setSelectOffice}
                />
            </div>

            <div className={`${styles.container} mb-2`}>
                <Button 
                className={styles.button_download} 
                disabled={services.length > 0 ? false : true}
                onClick={() => downloadPDF()}
                > 
                    <FaDownload className={styles.icon} /> PDF
                </Button>        
            </div>


            {
                errorLoading.success === false ? (
                    filterServices  ? (
                        <ServiceTable 
                        services={services}
                        />
                    ):(
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

export default ReportDentalService;
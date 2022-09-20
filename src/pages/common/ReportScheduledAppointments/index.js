import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FaDownload } from "react-icons/fa";
import { AppointmentsTable, Filters } from './components';
import { getOfficesActiveAndInactive } from 'services/OfficeService';
import { AlertMessage, ModalLoading } from 'components';
import { handleErrors, handleErrorLoading } from 'utils/handleErrors';
import { getLocalUser } from 'services/UserService';
import ROLES from 'constants/Roles';
import { getScheduledAppointments } from 'services/ReportsService';
import styles from './ReportScheduledAppointments.module.css';

const ReportScheduledAppointments = () => {

    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});

    const [selectDentist, setSelectDentist] = useState(null);
    const [offices, setOffices] = useState(null);
    const [appointments, setAppointments] = useState([]);
    
     // Estados para el filtro
     const [filterAppointments, setFilterAppointments] = useState(null);

     // Estado para el modal de carga 
     const [isLoading, setIsLoading] = useState(null);

    useEffect(() => {
        if(getLocalUser().roles.includes(ROLES.SUPERADMIN)) {
            getOfficesActiveAndInactive()
            .then(res => setOffices(res.data))
            .catch(err => handleErrorLoading(err, setErrorLoading));
        }
        
        setFilterAppointments(appointments);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

        getScheduledAppointments(data).then(res => {
            setAppointments(res.data);
            setFilterAppointments(res.data);
            setIsLoading({success: true});
        })
        .catch(err => handleErrorLoading(err, setErrorLoading));
    }

    return (
        <>
            { isLoading ? (isLoading.success === undefined ? <ModalLoading show={true} /> : "") : ""}
            <h1 className={'page_title'}>Reporte de citas agendadas</h1>
            <div className="underline mx-auto"></div>

            <div className={styles.container_filters}>
                <Filters
                offices={offices}
                searchAppointments={searchAppointments}
                />
            </div>

            <div className={`${styles.container}`}>
                <Button 
                className={styles.button_download} 
                disabled={appointments.length > 0 ? false : true}
                > 
                    <FaDownload className={styles.icon} /> PDF
                </Button>        
            </div>


            {
                errorLoading.success === false ? (
                    filterAppointments ? (
                        <AppointmentsTable
                        appointments={filterAppointments}
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

export default ReportScheduledAppointments;
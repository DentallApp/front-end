import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FaDownload } from "react-icons/fa";
import { saveAs } from 'file-saver';
import { AppointmentsTable, Filters } from './components';
import { getAppointmentStatus } from 'services/AppointmentStatusService';
import { getOfficesActiveAndInactive } from 'services/OfficeService';
import APPOINTMENT_STATUS from 'constants/AppointmentStatus';
import { AlertMessage, ModalLoading, FilterComponent } from 'components';
import { handleErrors, handleErrorLoading } from 'utils/handleErrors';
import { getLocalUser } from 'services/UserService';
import ROLES from 'constants/Roles';
import { getAppointments } from 'services/ReportsService';
import { downloadReportAppointment } from 'services/DownloadReportService';
import styles from './ReportAppointmentsPage.module.css';

const ReportAppointmentsPage = () => {

    const [errorLoading, setErrorLoading] = useState({success: false, message: ''});

    const [status, setStatus] = useState(null);
    const [offices, setOffices] = useState(null);
    const [appointments, setAppointments] = useState([]);
    
    // Estados para el filtro
    const [filterText, setFilterText] = useState('');
    const [filterAppointments, setFilterAppointments] = useState(null);
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    // Estado para el modal de carga 
    const [isLoading, setIsLoading] = useState(null);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Estado para el mensaje de alerta
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        getAppointmentStatus()
            .then(res => {
                setStatus(res.data.filter(status => 
                status.id === APPOINTMENT_STATUS[2].id || status.id === APPOINTMENT_STATUS[4].id || 
                status.id === APPOINTMENT_STATUS[5].id));
            })
            .catch(err => handleErrorLoading(err, setErrorLoading));

        if(getLocalUser().roles.includes(ROLES.SUPERADMIN)) {
            getOfficesActiveAndInactive()
            .then(res => setOffices(res.data))
            .catch(err => handleErrorLoading(err, setErrorLoading));
        }    
    }, []);


    useEffect(() => {
        if(filterAppointments?.length > 0 && filterText !== '') filterData();
        
        if(filterAppointments?.length <= 0 || filterText === '') setFilterAppointments(appointments);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText]);


    const filterData = () => {
        const data = appointments.filter(appointment => 
            appointment.patientName.toString().toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) === true 
        );
        setFilterAppointments(data);
    }

    // Función que capta los datos que se ingresa en el input y realiza el filtro de la tabla 
    const handleChange = (e) => {
        setFilterText(e.target.value.toString());
        if(filterText === '' || filterAppointments.length <= 0) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterAppointments(appointments);
        }
    }

    // Función que limpia los campos del input y resetea la tabla
    const handleClear = () => {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterAppointments(appointments);
        setFilterText('');
    };


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
        data.appoinmentStatusId = parseInt(data.appoinmentStatusId);

        getAppointments(data).then(res => {
            setAppointments(res.data);
            setFilterAppointments(res.data);
            setIsLoading({success: true});
        })
        .catch(err => handleErrorLoading(err, setErrorLoading));
    }

    const downloadPDF = async() => {
        setIsLoading({success: undefined});
        
        const appointments = filterAppointments.map(appointment => {
            return {
                appoinmentDate: appointment.appoinmentDate,
                startHour: appointment.startHour,
                patientName: appointment.patientName,
                dentalServiceName: appointment.dentalServiceName,
                dentistName: appointment.dentistName,
                officeName: appointment.officeName,
                status: appointment.appoinmentStatus
            }
        });

        const data = {
            from: startDate,
            to: endDate,
            appoinments: appointments
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

            <div className={styles.container_filters}>
                <Filters
                listStatus={status}
                offices={offices}
                searchAppointments={searchAppointments}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                />
            </div>

            <div className={`${styles.container} mb-2`}>
                {
                    errorLoading.success === false && (
                        <FilterComponent 
                        inputText='Digite nombre del paciente a buscar'
                        onFilter={handleChange} 
                        onClear={handleClear} 
                        filterText={filterText}
                        setFilterText={setFilterText}
                        /> 
                    )
                }    

                <Button 
                className={styles.button_download} 
                disabled={appointments.length > 0 ? false : true}
                onClick={() => downloadPDF()}
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

export default ReportAppointmentsPage;
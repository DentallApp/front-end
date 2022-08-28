import DataTable from 'react-data-table-component';
import { Button, Badge } from 'react-bootstrap';
import { FaSearch } from "react-icons/fa";
import APPOINTMENT_STATUS from '../../../../../constants/AppointmentStatus';
import styles from './AppointmentsTable.module.css';

// Opciones de paginación
const paginationOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
};

// Estilos personalizados
const customStyles = {
    headRow: {
        style: {
			backgroundColor: "#002855",
		}
    }
}

const AppointmentsTable = ({appointments, handleShow, setAppointmentSelect}) => {
    // Columnas de la tabla
    const columns = [
        {
            name: <div className={styles.container_table_header}><h6>Paciente</h6></div>,
            selector: row => row.patientName,
            sortable: true,
            wrap: true,
            width: "170px"
        },
        {
            name: <div className={styles.container_table_header}><h6>Servicio Dental</h6></div>,
            selector: row => row.dentalServiceName,
            sortable: true,
            wrap: true,
            minWidth: "170px",
        },
        {
            name: <div className={styles.container_table_header}><h6>Fecha de la Cita</h6></div>,
            selector: row => row.appointmentDate.toLocaleString('en-US'),
            center: true,
            sortable: true,
            wrap: true,
            width: "150px",
            sortFunction: (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
        },
        {
            name: <div className={styles.container_table_header}><h6>Hora de la Cita</h6></div>,
            selector: row => row.startHour ,
            center: true,
            wrap: true,
            width: "150px"
        },
        {
            name: <div className={styles.container_table_header}><h6>Estado</h6></div>,
            selector: row => 
                <div className={styles.badge_text}>
                    <Badge pill 
                    bg={APPOINTMENT_STATUS.filter(status => status.name === row.status)[0].colorName}>
                        {row.status.toUpperCase()}
                    </Badge>
                </div>,
            sortable: true,
            center: true,
            wrap: true,
            width: "150px"
        },
        {
            name: <div className={styles.container_table_header}><h6>Acciones</h6></div>,
            cell: (row) => {
                return (
                    <div className={styles.container_actions}>
                        <Button 
                        className={styles.button_information} 
                        onClick={() => {
                            setAppointmentSelect(row);
                            handleShow();
                        }}>
                            <FaSearch className={styles.icon} />
                             Más información
                        </Button>
                    </div>
                )
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            center: true,
            minWidth: "200px"
        }
    ];

    return (
        <div className={styles.container_datable}>
            <DataTable
            className={styles.rdt_TableHeadRow}
            columns={columns}
            data={appointments}
            pagination
            highlightOnHover={true}
            wrap={true}
            noDataComponent="No existen citas registradas en esta sección"
            fixedHeader
            fixedHeaderScrollHeight="600px"
            paginationComponentOptions={paginationOptions}
            customStyles={customStyles}
            />
        </div>
    );
}

export default AppointmentsTable;
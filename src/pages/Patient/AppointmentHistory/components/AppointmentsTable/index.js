import { useContext } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Badge } from 'react-bootstrap';
import { FaSearch } from "react-icons/fa";
import SideBarContext from 'context/SideBarContext';
import APPOINTMENT_STATUS from 'constants/AppointmentStatus';
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
    const { onlyWidth } = useContext(SideBarContext);

    // Columnas de la tabla
    const columns = [
        {
            name: <div className='container_table_header'><h6>Paciente</h6></div>,
            selector: row => row.patientName,
            wrap: true,
            width: onlyWidth >= 1400 ? "20%" : "170px"
        },
        {
            name: <div className='container_table_header'><h6>Servicio Dental</h6></div>,
            selector: row => row.dentalServiceName,
            wrap: true,
            width: onlyWidth >= 1400 ? "20%" : "170px",
        },
        {
            name: <div className='container_table_header'><h6>Fecha de la Cita</h6></div>,
            selector: row => row.appointmentDate,
            center: true,
            wrap: true,
            width: onlyWidth >= 1400 ? "20%" : "150px",
        },
        {
            name: <div className='container_table_header'><h6>Hora de la Cita</h6></div>,
            selector: row => row.startHour ,
            center: true,
            wrap: true,
            width: onlyWidth >= 1400 ? "10%" : "150px"
        },
        {
            name: <div className='container_table_header'><h6>Estado</h6></div>,
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
            width: onlyWidth >= 1400 ? "10%" : "150px"
        },
        {
            name: <div className='container_table_header'><h6>Acciones</h6></div>,
            cell: (row) => {
                return (
                    <div className='container_actions'>
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
            width: onlyWidth >= 1400 ? "20%" : "200px"
        }
    ];

    return (
        <div className='container_datable'>
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
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
            />
        </div>
    );
}

export default AppointmentsTable;
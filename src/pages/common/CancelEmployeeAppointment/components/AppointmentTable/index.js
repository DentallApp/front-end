import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import { MdVisibility } from "react-icons/md";
import { mappingAppointmentsForCancel } from '../../utils';
import styles from './AppointmentTable.module.css';

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
    },
    cells: {
        style: {
            textAlign: 'center',
        }
    }
}

const AppointmentTable = ({ 
    data, 
    setAppointmentSelect,
    setAppointmentsForCancel, 
    handleShow,
    setTypeModal 
}) => {
    // Columnas de la tabla
    const columns = [
        {
            name: <div className={styles.container_table_header}><h6>Fecha</h6></div>,
            selector: row => row.appointmentDate,
            center: true,
            wrap: true,
            width: "180px"
        },
        {
            name: <div className={styles.container_table_header}><h6>Hora</h6></div>,
            selector: row => `${row.startHour} - ${row.endHour}`,
            center: true,
            wrap: true,
            width: "120px"
        },
        {
            name: <div className={styles.container_table_header}><h6>Odontologo</h6></div>,
            selector: row => row.dentistName,
            center: true,
            wrap: true,
            width: "170px",
        },
        {
            name: <div className={styles.container_table_header}><h6>Paciente</h6></div>,
            selector: row => row.patientName,
            center: true,
            wrap: true,
            width: "170px"
        },
        {
            name: <div className={styles.container_table_header}><h6>Servicio</h6></div>,
            selector: row => row.dentalServiceName,
            center: true,
            wrap: true,
            width: "170px"
        },
        {
            name: <div className={styles.container_table_header}><h6>Acciones</h6></div>,
            cell: (row) => {
                return (
                    <div className={styles.container_actions}>
                        <Button 
                        className={styles.button_view} 
                        onClick={() => {
                            setAppointmentSelect(row);
                            handleShow();
                            setTypeModal('form');
                        }}>
                            <MdVisibility style={{'marginRight': '5px'}} /> Ver
                        </Button>
                    </div>
                )
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            center: true,
            width: "150px"
        }
    ];

    const handleChange = (selectedRows) => {
        setAppointmentsForCancel(mappingAppointmentsForCancel([...selectedRows.selectedRows]));
    }
    
    return (
        <div className={styles.container_datable}>
            <DataTable
            className={styles.rdt_TableHeadRow}
            columns={columns}
            data={data}
            pagination
            highlightOnHover={true}
            wrap={true}
            noDataComponent="No existen citas programadas"
            fixedHeader
            fixedHeaderScrollHeight="600px"
            paginationComponentOptions={paginationOptions}
            customStyles={customStyles}
            selectableRows
            onSelectedRowsChange={handleChange}
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
            />
        </div>
    );
}

export default AppointmentTable;
import { useContext } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Badge } from 'react-bootstrap';
import { FaEdit } from "react-icons/fa";
import { INFORMATION_NOT_AVAILABLE } from 'constants/InformationMessage';
import SideBarContext from 'context/SideBarContext';
import styles from './ScheduleTable.module.css';

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

const ScheduleTable = ({schedules, setSelectedSchedule, handleShow}) => {

    const { onlyWidth } = useContext(SideBarContext);

    // Columnas de la tabla
    const columns = [
        {
            name: <div className='container_table_header'><h6>Día</h6></div>,
            selector: row => row.weekDayName,
            center: true,
            wrap: true,
            width: onlyWidth >= 1300 ? "15%" : "100px"
        },
        {
            name: <div className='container_table_header'><h6>Estado</h6></div>,
            selector: row => 
                <div className={styles.badge_text}>
                    <Badge pill bg={row.isDeleted === false ? 'success' : 'danger'}>
                        {row.status}
                    </Badge>
                </div>,
            center: true,
            wrap: true,
            width: onlyWidth >= 1300 ? "15%" : "100px",
        },
        {
            name: <div className='container_table_header'><h6>Hora inicio (Mañana)</h6></div>,
            selector: row => (row.morningStartHour !== null || row.morningStartHour === "") 
                ? row.morningStartHour : INFORMATION_NOT_AVAILABLE,
            center: true,
            wrap: true,
            width: onlyWidth >= 1300 ? "15%" : "150px",
        },
        {
            name: <div className='container_table_header'><h6>Hora fin (Mañana)</h6></div>,
            selector: row => (row.morningEndHour !== null || row.morningStartHour === "") 
                ? row.morningEndHour : INFORMATION_NOT_AVAILABLE,
            center: true,
            wrap: true,
            width: onlyWidth >= 1300 ? "15%" : "150px"
        },
        {
            name: <div className='container_table_header'><h6>Hora inicio (Tarde)</h6></div>,
            selector: row => (row.afternoonStartHour !== null|| row.morningStartHour === "") 
                ? row.afternoonStartHour : INFORMATION_NOT_AVAILABLE,
            center: true,
            wrap: true,
            width: onlyWidth >= 1300 ? "15%" : "150px"
        },
        {
            name: <div className='container_table_header'><h6>Hora fin (Tarde)</h6></div>,
            selector: row => (row.afternoonEndHour !== null || row.morningStartHour === "") 
                ? row.afternoonEndHour : INFORMATION_NOT_AVAILABLE,
            center: true,
            wrap: true,
            width: onlyWidth >= 1300 ? "15%" : "150px"
        },
        {
            name: <div className='container_table_header'><h6>Acciones</h6></div>,
            cell: (row) => {
                return (
                    <div className='container_actions'>
                        <Button 
                        className='button_edit'
                        onClick={() => {
                            setSelectedSchedule(row);
                            handleShow();
                        }}>
                            <FaEdit />
                        </Button>
                    </div>
                )
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            center: true,
            width: onlyWidth >= 1300 ? "10%" : "120px"
        }
    ];

    return (
        <div className={styles.container_datable}>
            <DataTable
            className={styles.rdt_TableHeadRow}
            columns={columns}
            data={schedules}
            pagination
            highlightOnHover={true}
            wrap={true}
            noDataComponent="No existen horarios registrados para este empleado"
            fixedHeader
            fixedHeaderScrollHeight="600px"
            paginationComponentOptions={paginationOptions}
            customStyles={customStyles}
            />
    </div>
    );
}

export default ScheduleTable;
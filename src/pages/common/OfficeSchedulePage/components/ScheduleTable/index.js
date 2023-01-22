import { useContext } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Badge } from 'react-bootstrap';
import { FaEdit } from "react-icons/fa";
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
            width: onlyWidth >= 1300 ? "20%" : "150px"
        },
        {
            name: <div className='container_table_header'><h6>Estado</h6></div>,
            selector: row => 
                <div className={styles.badge_text}>
                    <Badge pill bg={row.isDeleted === false ? 'success' : 'danger'}>
                        {row.isDeleted === false ? 'ACTIVO' : 'INACTIVO'}
                    </Badge>
                </div>,
            center: true,
            wrap: true,
            width: onlyWidth >= 1300 ? "20%" : "100px",
        },
        {
            name: <div className='container_table_header'><h6>Hora de Apertura</h6></div>,
            selector: row => row.startHour,
            center: true,
            wrap: true,
            width: onlyWidth >= 1300 ? "20%" : "200px",
        },
        {
            name: <div className='container_table_header'><h6>Hora de Cierre</h6></div>,
            selector: row => row.endHour,
            center: true,
            wrap: true,
            width: onlyWidth >= 1300 ? "20%" : "200px"
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
            width: onlyWidth >= 1300 ? "20%" : "120px"
        }
    ];


    return (
        <div className={styles.container_datable}>
            <DataTable
            className='rdt_TableHeadRow'
            columns={columns}
            data={schedules}
            pagination
            highlightOnHover={true}
            wrap={true}
            noDataComponent="No existen horarios registrados para este consultorio"
            fixedHeader
            fixedHeaderScrollHeight="600px"
            paginationComponentOptions={paginationOptions}
            customStyles={customStyles}
            />
    </div>
    );
}

export default ScheduleTable;
import DataTable from 'react-data-table-component';
import { Badge } from 'react-bootstrap';
import { INFORMATION_NOT_AVAILABLE } from '../../../../../constants/InformationMessage';
import WEEKDAYS from '../../../../../constants/WeekDays';
import styles from './AllScheduleTable.module.css';

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

const getScheduleByDayId = (schedules, dayId) => {
    const listSchedule = schedules;
    const result = listSchedule.filter(schedule => schedule.weekDayId === dayId);
    
    return result;
}

const showSchedule = (schedule) => {
    return schedule[0] !== null && schedule[0] !== undefined ? (
        <>
            {
                schedule[0].morningStartHour && (
                    <>
                        <p style={{"fontWeight": "bold", "textAlign": "center"}}>Mañana: </p>
                        <p style={{"textAlign":"center"}}>
                            {schedule[0].morningStartHour} - {schedule[0].morningEndHour}
                        </p>
                    </>
                )
            }
            {
                schedule[0].afternoonStartHour && (
                    <>
                        <br/>
                        <p style={{"fontWeight": "bold", "textAlign": "center"}}>Tarde: </p>
                        <p style={{"textAlign":"center"}}>
                            {schedule[0].afternoonStartHour} - {schedule[0].afternoonEndHour}
                        </p>
                    </>
                )
            }
        </>
        
    ) : <p>{INFORMATION_NOT_AVAILABLE}</p>
}

const AllScheduleTable = ({allSchedules}) => {
    // Columnas de la tabla
    const columns = [
        {
            name: <div className={styles.container_table_header}><h6>Odontólogo</h6></div>,
            selector: row => row.fullName,
            center: true,
            wrap: true,
            width: "200px"
        },
        {
            name: <div className={styles.container_table_header}><h6>Estado</h6></div>,
            selector: row => 
                <div className={styles.badge_text}>
                    <Badge pill bg={row.isEmployeeDeleted === false ? 'success' : 'danger'}>
                        {row.isEmployeeDeleted === false ? 'ACTIVO' : 'INACTIVO'}
                    </Badge>
                </div>,
            center: true,
            wrap: true,
            minWidth: "100px",
        },
        {
            name: <div className={styles.container_table_header}><h6>Lunes</h6></div>,
            selector: row => {
                const result = getScheduleByDayId(row.schedules, WEEKDAYS[0].id);
                
                return showSchedule(result);
            },
            center: true,
            wrap: true,
            width: "200px",
        },
        {
            name: <div className={styles.container_table_header}><h6>Martes</h6></div>,
            selector: row => {
                const result = getScheduleByDayId(row.schedules, WEEKDAYS[1].id);
                return showSchedule(result);
            },
            center: true,
            wrap: true,
            width: "200px",
        },
        {
            name: <div className={styles.container_table_header}><h6>Miercoles</h6></div>,
            selector: row => {
                const result = getScheduleByDayId(row.schedules, WEEKDAYS[2].id);
                return showSchedule(result);
            },
            center: true,
            wrap: true,
            width: "200px"
        },
        {
            name: <div className={styles.container_table_header}><h6>Jueves</h6></div>,
            selector: row => {
                const result = getScheduleByDayId(row.schedules, WEEKDAYS[3].id);
                return showSchedule(result);
            },
            center: true,
            wrap: true,
            width: "150px"
        },
        {
            name: <div className={styles.container_table_header}><h6>Viernes</h6></div>,
            selector: row => {
                const result = getScheduleByDayId(row.schedules, WEEKDAYS[4].id);
                return showSchedule(result);
            },
            center: true,
            wrap: true,
            width: "150px"
        },
        {
            name: <div className={styles.container_table_header}><h6>Sabado</h6></div>,
            selector: row => {
                const result = getScheduleByDayId(row.schedules, WEEKDAYS[5].id);
                return showSchedule(result);
            },
            center: true,
            wrap: true,
            width: "150px"
        },
    ];

    return (
        <div className={styles.container_datable}>
            <DataTable
            columns={columns}
            data={allSchedules}
            pagination
            highlightOnHover={true}
            wrap={true}
            noDataComponent="No existen horarios registrados para los odontólogos"
            fixedHeader
            fixedHeaderScrollHeight="600px"
            paginationComponentOptions={paginationOptions}
            customStyles={customStyles}
            />
    </div>
    );
}

export default AllScheduleTable;
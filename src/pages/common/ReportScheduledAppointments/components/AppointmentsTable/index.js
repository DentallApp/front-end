import DataTable from 'react-data-table-component';
import { getLocalUser } from 'services/UserService';
import ROLES from 'constants/Roles';
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
    },
    cells: {
        style: {
            textAlign: 'center',
        }
    }
}

const AppointmentsTable = ({appointments}) => {

    // Columnas de la tabla
    const columns = [
        {
            name: <div className={styles.container_table_header}><h6>Fecha</h6></div>,
            selector: row => row.appoinmentDate,
            center: true,
            wrap: true,
            width: "150px"
        },
        {
            name: <div className={styles.container_table_header}><h6>Hora</h6></div>,
            selector: row => row.startHour,
            center: true,
            wrap: true,
            width: "150px"
        },
        {
            name: <div className={styles.container_table_header}><h6>Paciente</h6></div>,
            selector: row => row.patientName,
            center: true,
            wrap: true,
            width: "250px"
        },
        {
            name: <div className={styles.container_table_header}><h6>Servicio</h6></div>,
            selector: row => row.dentalServiceName,
            center: true,
            wrap: true,
            width: "200px"
        },
        {
            name: <div className={styles.container_table_header}><h6>Consultorio</h6></div>,
            selector: row =>  getLocalUser().roles.includes(ROLES.SUPERADMIN)  ?
                row.officeName :
                getLocalUser().officeName,
            center: true,
            wrap: true,
            width: "200px"
        }
    ];


    return (
        <div className={styles.container_datable} style={{'marginTop': '20px'}}>
            <DataTable
            className={styles.rdt_TableHeadRow}
            columns={columns}
            data={appointments}
            pagination
            highlightOnHover={true}
            wrap={true}
            noDataComponent="No existen datos para mostrar"
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
import DataTable from 'react-data-table-component';
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
            name: <div className={styles.container_table_header}><h6>Odontólogo</h6></div>,
            selector: row => row.dentistName,
            center: true,
            wrap: true,
            width: "37,50%"
        },
        {
            name: <div className={styles.container_table_header}><h6>Consultorio</h6></div>,
            selector: row => row.officeName,
            center: true,
            wrap: true,
            width: "37,50%"
        },
        {
            name: <div className={styles.container_table_header}><h6>Total</h6></div>,
            selector: row => row.total,
            center: true,
            wrap: true,
            width: "25%"
        },
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
import DataTable from 'react-data-table-component';
import styles from './ServiceTable.module.css';

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

const ServiceTable = ({services}) => {

    // Columnas de la tabla
    const columns = [
        {
            name: <div className={styles.container_table_header}><h6>Servicio dental</h6></div>,
            selector: row => row.dentalServiceName,
            center: true,
            wrap: true,
            width: "50%"
        },
        {
            name: <div className={styles.container_table_header}><h6>Total de citas atendidas</h6></div>,
            selector: row => row.totalAppointmentsAssisted,
            center: true,
            wrap: true,
            width: "50%"
        },
    ];


    return (
        <div className={styles.container_datable} style={{'marginTop': '20px'}}>
            <DataTable
            className={styles.rdt_TableHeadRow}
            columns={columns}
            data={services}
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

export default ServiceTable;

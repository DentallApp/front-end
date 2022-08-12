import DataTable from 'react-data-table-component';
import styles from './TreamentsTable.module.css';

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

// Columnas de la tabla
const columns = [
    {
        name: <div className={styles.container_table_header}><h6>Codigo</h6></div>,
        selector: row => row.id,
        sortable: true,
        center: true,
        wrap: true,
        width: "auto"
    },
    {
        name: <div className={styles.container_table_header}><h6>Tratamiento dental</h6></div>,
        selector: row => row.name,
        sortable: true,
        center: true,
        wrap: true,
        width: "auto"
    },
    {
        name: <div className={styles.container_table_header}><h6>Precio</h6></div>,
        selector: row => '$' + row.price,
        sortable: true,
        center: true,
        wrap: true,
        width: "150px"
    }
];

const TreatmentsTable = ({ treatments, paginationResetDefaultPage, setSelected, selectedTreatments } ) => {

    const handleChange = (selectedRows) => {
        setSelected([...selectedTreatments, ...selectedRows.selectedRows]);
    }

    return (
        <div className={styles.container_datable}>
            <DataTable
            className={styles.rdt_TableHeadRow}
            columns={columns}
            data={treatments}
            pagination
            highlightOnHover={true}
            wrap={true}
            noDataComponent="No hay tratamientos"
            fixedHeader
            fixedHeaderScrollHeight="600px"
            paginationComponentOptions={paginationOptions}
            paginationResetDefaultPage={paginationResetDefaultPage}
            customStyles={customStyles}
            selectableRows
            onSelectedRowsChange={handleChange}
            />
        </div>
    );
}

export default TreatmentsTable;
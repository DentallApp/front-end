import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import { AiFillDelete } from "react-icons/ai";
import styles from './SelectedTreatmentsTable.module.css';

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

const SelectedTreamentsTable = ({selectedTreatments, deleteSelected}) => {

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
        width: "auto"
    },
    {
        name: <div className={styles.container_table_header}><h6>Acciones</h6></div>,
        cell: (row) => {
            return (
                <div className={styles.container_actions}>
                    <Button 
                    className={styles.button_cancel} 
                    onClick={() => {
                        deleteSelected(row);
                    }}>
                        <AiFillDelete />
                    </Button>
                </div>
            )
        },
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        center: true,
        minWidth: "150px"
    }
];

    return (
        <div className={styles.container_datable}>
            <DataTable
            className={styles.rdt_TableHeadRow}
            columns={columns}
            data={selectedTreatments}
            pagination
            paginationComponentOptions={paginationOptions}
            highlightOnHover={true}
            wrap={true}
            noDataComponent="No ha agregado tratamientos a su cotización"
            fixedHeader
            fixedHeaderScrollHeight="600px"
            customStyles={customStyles}
            />
        </div>
    );
}

export default SelectedTreamentsTable;
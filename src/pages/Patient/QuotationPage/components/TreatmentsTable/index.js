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
        name: <div className='container_table_header'><h6>Codigo</h6></div>,
        selector: row => row.specificTreatmentId,
        sortable: true,
        center: true,
        wrap: true,
        minWidth: "100px"
    },
    {
        name: <div className='container_table_header'><h6>Tratamiento dental</h6></div>,
        selector: row => row.specificTreatmentName,
        sortable: true,
        center: true,
        cell: row => <div style={{"width": "100%", "textAlign":"center"}}>{row.specificTreatmentName}</div>,
        wrap: true,
        minWidth: '150px'
    },
    {
        name: <div className='container_table_header'><h6>Servicio dental</h6></div>,
        selector: row => row.generalTreatmentName,
        sortable: true,
        center: true,
        cell: row => <div style={{"width": "100%", "textAlign":"center"}}>{row.generalTreatmentName}</div>,
        wrap: true,
        minWidth: '150px'
        
    },
    {
        name: <div className='container_table_header'><h6>Precio</h6></div>,
        selector: row => '$' + row.price,
        sortable: true,
        center: true,
        wrap: true,
        width: "100px"
    }
];

const TreatmentsTable = ({ treatments, paginationResetDefaultPage, setSelected } ) => {

    const handleChange = (selectedRows) => {
        setSelected([...selectedRows.selectedRows]);
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
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
            />
        </div>
    );
}

export default TreatmentsTable;
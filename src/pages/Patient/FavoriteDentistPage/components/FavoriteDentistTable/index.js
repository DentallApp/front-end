import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import { AiFillDelete } from "react-icons/ai";
import styles from './FavoriteDentistTable.module.css';

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

const FavoriteDentistTable = ({dentists, setDentistSelect, handleShow}) => {
    // Columnas de la tabla
    const columns = [
        {
            name: <div className={styles.container_table_header}><h6>Odontologo</h6></div>,
            selector: row => row.fullName,
            center: true,
            wrap: true,
            cell: row => <p style={{'textAlign': 'center'}}>{row.fullName}</p>,
            width: "200px"
        },
        {
            name: <div className={styles.container_table_header}><h6>Pregrado</h6></div>,
            selector: row => row.pregradeUniversity === null || row.pregradeUniversity === '' ? 
                'Información no disponible' : row.pregradeUniversity,
            center: true,
            wrap: true,
            cell: row => <p style={{'textAlign': 'center'}}>{
                row.pregradeUniversity === null || row.pregradeUniversity === '' ? 
                'Información no disponible' : row.pregradeUniversity}</p>,
            width: '200px'
            
        },
        {
            name: <div className={styles.container_table_header}><h6>Posgrado</h6></div>,
            selector: row => row.postgradeUniversity === null || row.pregradeUniversity === '' ? 
                'Información no disponible' : row.postgradeUniversity,
            center: true,
            wrap: true,
            cell: row => <p style={{'textAlign': 'center'}}>{
                row.postgradeUniversity === null || row.postgradeUniversity === '' ? 
                'Información no disponible' : row.postgradeUniversity}</p>,
            width: "200px",
        },
        {
            name: <div className={styles.container_table_header}><h6>Consultorio</h6></div>,
            selector: row => row.officeName,
            center: true,
            wrap: true,
            width: "200px",
        },
        {
            name: <div className={styles.container_table_header}><h6>Acciones</h6></div>,
            cell: (row) => {
                return (
                    <div className={styles.container_actions}>
                        <Button 
                        className={styles.button_cancel} 
                        onClick={() => {
                            setDentistSelect(row);
                            handleShow();
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
            data={dentists}
            pagination
            paginationComponentOptions={paginationOptions}
            highlightOnHover={true}
            wrap={true}
            noDataComponent="No hay odontologos agregados"
            fixedHeader
            fixedHeaderScrollHeight="600px"
            customStyles={customStyles}
            />
        </div>
    );
}

export default FavoriteDentistTable;
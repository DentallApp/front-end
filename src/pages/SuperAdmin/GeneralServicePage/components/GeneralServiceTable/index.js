import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { MinutesToHours } from 'utils/timeUtils';
import styles from './GeneralServiceTable.module.css';

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

const GeneralServiceTable = (
    { 
        services, 
        paginationResetDefaultPage, 
        setServiceSelect, 
        setTypeModal,
        handleShow 
    }) => {
    
    // Columnas de la tabla
    const columns = [
        {
            name: <div className={styles.container_table_header}><h6>Servicio Dental</h6></div>,
            selector: row => row.name,
            sortable: true,
            center: true,
            wrap: true,
            width: "col col-2"
        },
        {
            name: <div className={styles.container_table_header}><h6>Duración (horas)</h6></div>,
            selector: row => MinutesToHours(row.duration),
            wrap: true,
            center: true,
            width: "col col-2"
        },
        {
            name: <div className={styles.container_table_header}><h6>Acciones</h6></div>,
            cell: (row) => {
                return (
                    <div className={styles.container_actions}>
                        <Button 
                        className={styles.button_edit} 
                        onClick={() => {
                            setServiceSelect(row);
                            setTypeModal('form');
                            handleShow();
                        }}>
                            <FaEdit />
                        </Button>
                        <Button 
                        className={styles.button_cancel} 
                        onClick={() => {
                            setServiceSelect(row);
                            setTypeModal('warning');
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
            data={services}
            pagination
            highlightOnHover={true}
            wrap={true}
            noDataComponent="No existen servicios registrados"
            fixedHeader
            fixedHeaderScrollHeight="600px"
            paginationComponentOptions={paginationOptions}
            paginationResetDefaultPage={paginationResetDefaultPage}
            customStyles={customStyles}
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
            />
        </div>
    );
}

export default GeneralServiceTable;
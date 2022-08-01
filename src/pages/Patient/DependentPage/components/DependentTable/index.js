import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import styles from './DependentTable.module.css';

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

const DependentTable = (
    {
        dependents, 
        paginationResetDefaultPage, 
        handleShow, 
        setDependentSelect,
        setTypeModal
    }) => {

    // Columnas de la tabla
    const columns = [
        {
            name: <div className={styles.container_table_header}><h6>Nombre</h6></div>,
            selector: row => row.names,
            sortable: true,
            wrap: true,
            width: "col col-lg-2"
        },
        {
            name: <div className={styles.container_table_header}><h6>Apellidos</h6></div>,
            selector: row => row.lastNames,
            sortable: true,
            wrap: true,
            width: "col col-lg-2"
        },
        {
            name: <div className={styles.container_table_header}><h6>Fecha Nacimiento</h6></div>,
            selector: row => moment(row.dateBirth).format('DD/MM/YYYY'),
            sortable: true,
            center: true,
            wrap: true,
            width: "auto"
        },
        {
            name: <div className={styles.container_table_header}><h6>Celular</h6></div>,
            selector: row => row.cellPhone,
            sortable: true,
            minWidth: "auto"
        },
        {
            name: <div className={styles.container_table_header}><h6>Correo</h6></div>,
            selector: row => row.email,
            sortable: true,
            wrap: true,
            minWidth: "170px",
        },
        {
            name: <div className={styles.container_table_header}><h6>Cedula</h6></div>,
            selector: row => row.document,
            sortable: true,
            minWidth: "auto"
        },
        {
            name: <div className={styles.container_table_header}><h6>Parentesco</h6></div>,
            selector: row => row.kinshipName,
            sortable: true,
            center: true,
            wrap: true,
            width: "150px"
        },
        {
            name: <div className={styles.container_table_header}><h6>Acciones</h6></div>,
            cell: (row) => {
                return (
                    <div className={styles.container_actions}>
                        <Button 
                        className={styles.button_edit} 
                        onClick={() => {
                            setDependentSelect(row);
                            setTypeModal('form');
                            handleShow();
                        }}>
                            <FaEdit />
                        </Button>
                        <Button 
                        className={styles.button_cancel} 
                        onClick={() => {
                            setDependentSelect(row);
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
            minWidth: "200px"
        }
    ];
    
    return (
        <div className={styles.container_datable}>
            <DataTable
            className={styles.rdt_TableHeadRow}
            columns={columns}
            data={dependents}
            pagination
            highlightOnHover={true}
            wrap={true}
            fixedHeader
            fixedHeaderScrollHeight="600px"
            paginationComponentOptions={paginationOptions}
            paginationResetDefaultPage={paginationResetDefaultPage}
            customStyles={customStyles}
            />
        </div>
    );
}

export default DependentTable;
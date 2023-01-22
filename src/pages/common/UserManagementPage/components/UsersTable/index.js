import { useContext } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Badge } from 'react-bootstrap';
import { FaEdit } from "react-icons/fa";
import SideBarContext from 'context/SideBarContext';
import styles from './UsersTable.module.css';

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

const UsersTable = (
    {
        users, 
        paginationResetDefaultPage, 
        handleShow, 
        setUserSelect,
        setTypeModal
    }) => {

    const { onlyWidth } = useContext(SideBarContext);

    // Columnas de la tabla
    const columns = [
        {
            name: <div className='container_table_header'><h6>Nombre</h6></div>,
            selector: row => row.names,
            sortable: true,
            center: true,
            wrap: true,
            width: onlyWidth >= 1800 ? "15%" : "col col-lg-1"
        },
        {
            name: <div className='container_table_header'><h6>Apellidos</h6></div>,
            selector: row => row.lastNames,
            sortable: true,
            wrap: true,
            width: onlyWidth >= 1800 ? "10%" : "col col-lg-1"
        },
        {
            name: <div className='container_table_header'><h6>Correo</h6></div>,
            selector: row => row.email,
            wrap: true,
            width: onlyWidth >= 1800 ? "15%" : "170px",
        },
        {
            name: <div className='container_table_header'><h6>Cedula</h6></div>,
            selector: row => row.document,
            center: true,
            wrap: true,
            width: onlyWidth >= 1800 ? "15%" : "150px"
        },
        {
            name: <div className='container_table_header'><h6>Consultorio</h6></div>,
            selector: row => row.officeName,
            center: true,
            wrap: true,
            width: onlyWidth >= 1800 ? "15%" : "150px"
        },
        {
            name: <div className='container_table_header'><h6>Roles</h6></div>,
            selector: row => row.roles.map(role => role.name).toString().replaceAll(",", "\n"),
            center: true,
            wrap: true,
            width: onlyWidth >= 1800 ? "10%" : "150px"
        },
        {
            name: <div className='container_table_header'><h6>Estado</h6></div>,
            selector: row => 
                <div className={styles.badge_text}>
                    <Badge pill bg={row.isDeleted === false ? 'success' : 'danger'}>{row.status}</Badge>
                </div>,
            sortable: true,
            center: true,
            wrap: true,
            width: onlyWidth >= 1800 ? "10%" : "120px",
        },
        {
            name: <div className='container_table_header'><h6>Acciones</h6></div>,
            cell: (row) => {
                return (
                    <div className='container_actions'>
                        <Button 
                        className='button_edit' 
                        onClick={() => {
                            setUserSelect(row);
                            setTypeModal('form');
                            handleShow();
                        }}>
                            <FaEdit />
                        </Button>
                    </div>
                )
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            center: true,
            width: onlyWidth >= 1800 ? "10%" : "120px"
        }
    ];
    
    return (
        <div className={styles.container_datable}>
            <DataTable
            className={styles.rdt_TableHeadRow}
            columns={columns}
            data={users}
            pagination
            highlightOnHover={true}
            wrap={true}
            noDataComponent="No existen usuarios registrados"
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

export default UsersTable;
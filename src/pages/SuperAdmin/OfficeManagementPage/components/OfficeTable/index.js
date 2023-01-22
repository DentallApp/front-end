import { useContext } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Badge } from 'react-bootstrap';
import { FaEdit } from "react-icons/fa";
import { INFORMATION_NOT_AVAILABLE } from 'constants/InformationMessage';
import SideBarContext from 'context/SideBarContext';
import styles from './OfficeTable.module.css';

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

const OfficeTable = ({offices, setOfficeSelect, handleShow, paginationResetDefaultPage}) => {

    const { onlyWidth } = useContext(SideBarContext);

    // Columnas de la tabla
    const columns = [
        {
            name: <div className='container_table_header'><h6>Consultorio</h6></div>,
            selector: row => row.name,
            sortable: true,
            center: true,
            wrap: true,
            width: onlyWidth >= 1300 ? "20%" : "150px"
        },
        {
            name: <div className='container_table_header'><h6>Dirección</h6></div>,
            selector: row => row.address,
            wrap: true,
            center: true,
            width: onlyWidth >= 1300 ? "20%" : "270px"
        },
        {
            name: <div className='container_table_header'><h6>Teléfono</h6></div>,
            selector: row => row.contactNumber ? row.contactNumber : INFORMATION_NOT_AVAILABLE,
            wrap: true,
            center: true,
            width: onlyWidth >= 1300 ? "20%" : "200px",
        },
        {
            name: <div className='container_table_header'><h6>Estado</h6></div>,
            selector: row => 
                <div className={styles.badge_text}>
                    <Badge pill bg={row.isDeleted === false ? 'success' : 'danger'}>
                        {row.isDeleted === false ? 'ACTIVO' : 'INACTIVO' }
                    </Badge>
                </div>,
            center: true,
            wrap: true,
            width: onlyWidth >= 1300 ? "20%" : "120px",
        },
        {
            name: <div className='container_table_header'><h6>Acciones</h6></div>,
            cell: (row) => {
                return (
                    <div className='container_actions'>
                        <Button 
                        className='button_edit' 
                        onClick={() => {
                            setOfficeSelect(row);
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
            width: onlyWidth >= 1300 ? "20%" : "120px"
        }
    ];

    return (
        <div className='container_datable'>
            <DataTable
            className='rdt_TableHeadRow'
            columns={columns}
            data={offices}
            pagination
            highlightOnHover={true}
            wrap={true}
            noDataComponent="No existen consultorios registrados"
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

export default OfficeTable;

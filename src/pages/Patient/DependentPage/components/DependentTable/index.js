import { useContext } from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import SideBarContext from 'context/SideBarContext';

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

    const { onlyWidth } = useContext(SideBarContext);
    
    // Columnas de la tabla
    const columns = [
        {
            name: <div className='container_table_header'><h6>Nombre</h6></div>,
            selector: row => row.names,
            sortable: true,
            wrap: true,
            width: onlyWidth >= 1400 ? "15%" : "col col-lg-2"
        },
        {
            name: <div className='container_table_header'><h6>Apellidos</h6></div>,
            selector: row => row.lastNames,
            sortable: true,
            wrap: true,
            width: onlyWidth >= 1400 ? "15%" : "col col-lg-2"
        },
        {
            name: <div className='container_table_header'><h6>Fecha Nacimiento</h6></div>,
            selector: row => moment(row.dateBirth).format('DD/MM/YYYY'),
            sortable: true,
            center: true,
            wrap: true,
            width: onlyWidth >= 1400 ? "15%" : "auto"
        },
        {
            name: <div className='container_table_header'><h6>Correo</h6></div>,
            selector: row => row.email,
            wrap: true,
            width: onlyWidth >= 1400 ? "20%" : "170px",
        },
        {
            name: <div className='container_table_header'><h6>Cedula</h6></div>,
            selector: row => row.document,
            width: onlyWidth >= 1400 ? "10%" : "auto"
        },
        {
            name: <div className='container_table_header'><h6>Parentesco</h6></div>,
            selector: row => row.kinshipName,
            sortable: true,
            center: true,
            wrap: true,
            width: onlyWidth >= 1400 ? "10%" : "150px"
        },
        {
            name: <div className='container_table_header'><h6>Acciones</h6></div>,
            cell: (row) => {
                return (
                    <div className='container_actions'>
                        <Button 
                        className='button_edit' 
                        onClick={() => {
                            setDependentSelect(row);
                            setTypeModal('form');
                            handleShow();
                        }}>
                            <FaEdit />
                        </Button>
                        <Button 
                        className='button_cancel' 
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
            width: onlyWidth >= 1400 ? "15%" : "200px"
        }
    ];
    
    return (
        <div className='container_datable'>
            <DataTable
            className='rdt_TableHeadRow'
            columns={columns}
            data={dependents}
            pagination
            highlightOnHover={true}
            wrap={true}
            noDataComponent="No existen dependientes registrados"
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

export default DependentTable;
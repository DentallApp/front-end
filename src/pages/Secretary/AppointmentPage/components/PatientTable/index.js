import { useContext } from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import { FaEdit } from "react-icons/fa";
import SideBarContext from 'context/SideBarContext';
import styles from './PatientTable.module.css';

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

const PatientTable = (
    { 
        patients, 
        paginationResetDefaultPage, 
        setPatientSelect, 
        handleShow 
    }) => {

    const { onlyWidth } = useContext(SideBarContext);    
    
    // Columnas de la tabla
    const columns = [
        {
            name: <div className='container_table_header'><h6>Nombres</h6></div>,
            selector: row => row.names,
            sortable: true,
            center: true,
            wrap: true,
            width: onlyWidth >= 1300 ? "17.5%" : "col col-2"
        },
        {
            name: <div className='container_table_header'><h6>Apellidos</h6></div>,
            selector: row => row.lastNames,
            sortable: true,
            wrap: true,
            center: true,
            width: onlyWidth >= 1300 ? "17.5%" : "col col-2"
        },
        {
            name: <div className='container_table_header'><h6>Cedula</h6></div>,
            selector: row => row.document,
            wrap: true,
            center: true,
            width: onlyWidth >= 1300 ? "15%" : "150px"
        },
        {
            name: <div className='container_table_header'><h6>Telefono</h6></div>,
            selector: row => row.cellPhone,
            wrap: true,
            center: true,
            width: onlyWidth >= 1300 ? "15%" : "150px"
        },
        {
            name: <div className='container_table_header'><h6>Correo</h6></div>,
            selector: row => row.email,
            wrap: true,
            center: true,
            width: onlyWidth >= 1300 ? "20%" : "150px"
        },
        {
            name: <div className='container_table_header'><h6>Acciones</h6></div>,
            cell: (row) => {
                return (
                    <div className='container_actions'>
                        <Button 
                        className={styles.button_appointment} 
                        onClick={() => {
                            setPatientSelect(row);
                            handleShow();
                        }}>
                            <FaEdit /> Agendar
                        </Button>
                    </div>
                )
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            center: true,
            width: onlyWidth >= 1300 ? "15%" : "150px"
        }
    ];

    return (
        <div className='container_datable'>
            <DataTable
            className={styles.rdt_TableHeadRow}
            columns={columns}
            data={patients}
            pagination
            highlightOnHover={true}
            wrap={true}
            noDataComponent="No existe paciente con esos datos"
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

export default PatientTable;
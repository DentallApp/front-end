import { useContext } from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import { AiFillDelete } from "react-icons/ai";
import SideBarContext from 'context/SideBarContext';

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

    const { onlyWidth } = useContext(SideBarContext);

    // Columnas de la tabla
    const columns = [
    {
        name: <div className='container_table_header'><h6>Codigo</h6></div>,
        selector: row => row.specificTreatmentId,
        sortable: true,
        center: true,
        wrap: true,
        width: onlyWidth >= 1300 ? "20%" : "100px"
    },
    {
        name: <div className='container_table_header'><h6>Tratamiento dental</h6></div>,
        selector: row => row.specificTreatmentName,
        sortable: true,
        center: true,
        cell: row => <div style={{"width": "100%", "textAlign":"center"}}>{row.specificTreatmentName}</div>,
        wrap: true,
        width: onlyWidth >= 1300 ? "20%" : '200px'
    },
    {
        name: <div className='container_table_header'><h6>Servicio dental</h6></div>,
        selector: row => row.generalTreatmentName,
        sortable: true,
        center: true,
        cell: row => <div style={{"width": "100%", "textAlign":"center"}}>{row.generalTreatmentName}</div>,
        wrap: true,
        width: onlyWidth >= 1300 ? "20%" : '150px'
        
    },
    {
        name: <div className='container_table_header'><h6>Precio</h6></div>,
        selector: row => '$' + row.price,
        sortable: true,
        center: true,
        wrap: true,
        width: onlyWidth >= 1300 ? "20%" : "100px",
        sortFunction: (a, b) => a.price - b.price
    },
    {
        name: <div className='container_table_header'><h6>Acciones</h6></div>,
        cell: (row) => {
            return (
                <div className='container_actions'>
                    <Button 
                    className='button_cancel' 
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
        width: onlyWidth >= 1300 ? "20%" : "150px"
    }
];

    return (
        <div className='container_datable'>
            <DataTable
            className='rdt_TableHeadRow'
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
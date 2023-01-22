import { useContext } from 'react';
import DataTable from 'react-data-table-component';
import FavoriteButton from '../FavoriteButton';
import { INFORMATION_NOT_AVAILABLE } from 'constants/InformationMessage';
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

const DentistTable = ({filterDentists, setAlert, setIsLoading}) => {

    const { onlyWidth } = useContext(SideBarContext);

    // Columnas de la tabla
    const columns = [
        {
            name: <div className='container_table_header'><h6>Odontologo</h6></div>,
            selector: row => row.fullName,
            center: true,
            wrap: true,
            cell: row => <p style={{'textAlign': 'center'}}>{row.fullName}</p>,
            width: onlyWidth >= 1300 ? "20%" : "250px"
        },
        {
            name: <div className='container_table_header'><h6>Pregrado</h6></div>,
            selector: row => row.pregradeUniversity === null || row.pregradeUniversity === '' ? 
                INFORMATION_NOT_AVAILABLE : row.pregradeUniversity,
            center: true,
            wrap: true,
            cell: row => <p style={{'textAlign': 'center'}}>{
                row.pregradeUniversity === null || row.pregradeUniversity === '' ? 
                INFORMATION_NOT_AVAILABLE : row.pregradeUniversity}</p>,
            width: onlyWidth >= 1300 ? "20%" : '200px'
        },
        {
            name: <div className='container_table_header'><h6>Posgrado</h6></div>,
            selector: row => row.postgradeUniversity === null || row.pregradeUniversity === '' ? 
                INFORMATION_NOT_AVAILABLE : row.postgradeUniversity,
            center: true,
            wrap: true,
            cell: row => <p style={{'textAlign': 'center'}}>{
                row.postgradeUniversity === null || row.postgradeUniversity === '' ? 
                INFORMATION_NOT_AVAILABLE : row.postgradeUniversity}</p>,
            width: onlyWidth >= 1300 ? "20%" : "200px",
        },
        {
            name: <div className='container_table_header'><h6>Consultorio</h6></div>,
            selector: row => row.officeName,
            center: true,
            wrap: true,
            width: onlyWidth >= 1300 ? "20%" : "200px",
        },
        {
            name: <div className='container_table_header'><h6>Acciones</h6></div>,
            cell: (row) => {
                return (
                    <div className='container_actions'>
                        <FavoriteButton
                        dentist={row}
                        setAlert={setAlert}
                        setIsLoading={setIsLoading}
                        />
                    </div>
                )
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            center: true,
            width: onlyWidth >= 1300 ? "20%" : "200px"
        }
    ];
    return (
        <div className='container_datable'>
            <DataTable
            className='rdt_TableHeadRow'
            columns={columns}
            data={filterDentists}
            pagination
            paginationComponentOptions={paginationOptions}
            highlightOnHover={true}
            wrap={true}
            noDataComponent="No hay datos para mostrar"
            fixedHeader
            fixedHeaderScrollHeight="600px"
            customStyles={customStyles}
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
            />
        </div>
    );
}

export default DentistTable;
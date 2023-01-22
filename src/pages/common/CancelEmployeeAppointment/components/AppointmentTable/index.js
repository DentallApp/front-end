import { useContext } from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import { MdVisibility } from "react-icons/md";
import { getLocalUser } from 'services/UserService';
import { mappingAppointmentsForCancel } from '../../utils';
import ROLES from 'constants/Roles';
import SideBarContext from 'context/SideBarContext';
import styles from './AppointmentTable.module.css';

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

const AppointmentTable = ({ 
    data,
    setAppointmentSelect,
    setAppointmentsForCancel, 
    handleShow,
    setTypeModal 
}) => {

    const { onlyWidth } = useContext(SideBarContext);

    // Columnas de la tabla
    const columns = [
        {
            name: <div className='container_table_header'><h6>Fecha</h6></div>,
            selector: row => row.appointmentDate,
            center: true,
            wrap: true,
            width: onlyWidth >= 1300 ? "15%" : "180px"
        },
        {
            name: <div className='container_table_header'><h6>Hora</h6></div>,
            selector: row => `${row.startHour} - ${row.endHour}`,
            center: true,
            wrap: true,
            width: onlyWidth >= 1300 ? "15%" : "120px"
        },
        {
            name: <div className='container_table_header'><h6>Odontologo</h6></div>,
            selector: row => (getLocalUser().roles.includes(ROLES.SECRETARY) || 
                getLocalUser().roles.includes(ROLES.ADMIN) || 
                getLocalUser().roles.includes(ROLES.SUPERADMIN)) ?
                row.dentistName :
                getLocalUser().fullName,
            center: true,
            wrap: true,
            width: onlyWidth >= 1300 ? "15%" : "170px",
        },
        {
            name: <div className='container_table_header'><h6>Paciente</h6></div>,
            selector: row => row.patientName,
            center: true,
            wrap: true,
            width: onlyWidth >= 1300 ? "15%" : "170px"
        },
        {
            name: <div className='container_table_header'><h6>Servicio</h6></div>,
            selector: row => row.dentalServiceName,
            center: true,
            wrap: true,
            width: onlyWidth >= 1300 ? "20%" : "170px"
        },
        {
            name: <div className='container_table_header'><h6>Acciones</h6></div>,
            cell: (row) => {
                return (
                    <div className='container_actions'>
                        <Button 
                        className={styles.button_view} 
                        onClick={() => {
                            setAppointmentSelect(row);
                            handleShow();
                            setTypeModal('form');
                        }}>
                            <MdVisibility style={{'marginRight': '5px'}} /> Ver
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

    const handleChange = (selectedRows) => {
        if(data.filter(a => selectedRows.selectedRows.some(row => a.appointmentId === row.appointmentId)).length > 0) {
            setAppointmentsForCancel(mappingAppointmentsForCancel(data.filter(a => selectedRows.selectedRows.some(row => a.appointmentId === row.appointmentId))));
        }
        else {
            setAppointmentsForCancel(null);
        }
    }
    
    return (
        <div className='container_datable'>
            <DataTable
            className={styles.rdt_TableHeadRow}
            columns={columns}
            data={data}
            pagination
            highlightOnHover={true}
            wrap={true}
            noDataComponent="No existen citas programadas"
            fixedHeader
            fixedHeaderScrollHeight="600px"
            paginationComponentOptions={paginationOptions}
            customStyles={customStyles}
            selectableRows
            onSelectedRowsChange={handleChange}
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
            />
        </div>
    );
}

export default AppointmentTable;
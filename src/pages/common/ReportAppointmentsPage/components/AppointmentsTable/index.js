import styles from './AppointmentsTable.module.css';

const AppointmentsTable = ({appointmentReport}) => {

    return (
        <>
            {
                appointmentReport !== null && (
                    <div className={styles.container_datatable} style={{'marginTop': '20px'}}>
                            <table>
                                <thead>
                                    <tr className={styles.heading}>
                                        <td>Estado de cita</td>
                                        <td>Total</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Asistida</td>
                                        <td>{appointmentReport.totalAppointmentsAssisted}</td>
                                    </tr>
                                    <tr>
                                        <td>No Asistida</td>
                                        <td>{appointmentReport.totalAppointmentsNotAssisted}</td>
                                    </tr>
                                    <tr>
                                        <td>Cancelada por Paciente</td>
                                        <td>{appointmentReport.totalAppointmentsCancelledByPatient}</td>
                                    </tr>
                                    <tr>
                                        <td>Cancelada por Empleado</td>
                                        <td>{appointmentReport.totalAppointmentsCancelledByEmployee}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className={styles.container_total}>
                                <h5 className={styles.total}>TOTAL DE CITAS: {appointmentReport.total}</h5>
                            </div>
                        </div>
                    )
            }
        </>
    );
}

export default AppointmentsTable;
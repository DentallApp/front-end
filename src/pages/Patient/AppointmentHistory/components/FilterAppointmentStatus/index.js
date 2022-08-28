import { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import styles from './FilterAppointmentStatus.module.css';

const FilterAppointmentStatus = ({listStatus, statusSelected, setStatusSelected, setIsChange}) => {

    const [appointmentStatus, setAppointmentStatus] = useState(null);

    useEffect(() => {
        setAppointmentStatus(listStatus);
    }, []);

    const handleChange = (e) => {
        setStatusSelected(e.target.value);
    }

    return (
        <Form className={styles.container_form}>
            <Row>
                <Col sm={12} lg={5}>
                    <Form.Group className="mb-3" controlId="formBasicStatus">
                        <Form.Label className={styles.label_input}>Seleccione estado de la cita</Form.Label>
                        <Form.Select
                        name="statusId"
                        value={statusSelected !== null && statusSelected}
                        onChange={handleChange}
                        >
                        <option  
                        value='0'>
                            Todas las citas
                        </option>    
                        { appointmentStatus && (
                            appointmentStatus.map(data => (
                                <option 
                                key={data.id} 
                                value={data.id}>
                                    {data.name}
                                </option>
                            ))
                        )}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    );
}

export default FilterAppointmentStatus;
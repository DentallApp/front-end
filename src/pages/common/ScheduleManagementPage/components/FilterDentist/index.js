import { Form, Row, Col } from 'react-bootstrap';

import styles from './FilterDentist.module.css';

const FilterDentist = ({dentists, handleSelectDentist }) => {

    return (
        <Form className={styles.container_form}>
            <Row>
                <Col sm={12} lg={5}>
                    <Form.Group className="mb-3" controlId="formBasicDentist">
                        <Form.Label className={styles.label_input}>Odontólogos</Form.Label>
                        <Form.Select
                        name="dentist"
                        onChange={handleSelectDentist}
                        >
                        <option  
                        value='0'>
                            Seleccione
                        </option>    
                        { dentists && (
                            dentists.map(data => (
                                <option 
                                key={data.employeeId} 
                                value={data.employeeId}>
                                    {data.fullName}
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

export default FilterDentist;
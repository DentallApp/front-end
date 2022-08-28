import { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { getOffices } from '../../../../../services/OfficeService';
import styles from './FilterOffice.module.css';

const FilterOffice = ({setSelectOffice}) => {

    const [offices, setOffices] = useState(null);

    useEffect(() => {
        getOffices().then(response => setOffices(response.data))
            .catch(error => error); 
    }, []);

    const handleChange = (e) => {
        setSelectOffice(e.target.value);
        console.log(e.target.value);
    }

    return (
        <Form className={styles.container_form}>
            <Row>
                <Col sm={12} lg={5}>
                    <Form.Group className="mb-3" controlId="formBasicOffice">
                        <Form.Label className={styles.label_input}>Consultorios</Form.Label>
                        <Form.Select
                        name="office"
                        onChange={handleChange}
                        >
                        <option  
                        value='0'>
                            Todos
                        </option>    
                        { offices && (
                            offices.map(data => (
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

export default FilterOffice;
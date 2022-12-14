import { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { getOffices } from 'services/OfficeService';
import styles from './FilterOffice.module.css';

const FilterOffice = ({
    selectOffice, 
    setSelectOffice,
    dentists, 
    setFilterDentists}) => {

    const [offices, setOffices] = useState(null);

    useEffect(() => {
        getOffices().then(response => setOffices(response.data))
            .catch(error => error); 
    }, []);

    const handleChange = (e) => {
        setSelectOffice(e.target.value);

        if(parseInt(e.target.value) === 0) {
            setFilterDentists(dentists);
        }
        else {
            const data = dentists.filter(dentist => dentist.officeId === parseInt(e.target.value));
            setFilterDentists(data);
        }
    }

    return (
        <Form className={styles.container_form}>
            <Row>
                <Col sm={12} md={5} lg={5} xl={3} xxl={3}>
                    <Form.Group className="mb-3" controlId="formBasicOffice">
                        <Form.Label className={styles.label_input}>Consultorios</Form.Label>
                        <Form.Select
                        name="office"
                        value={selectOffice!== null && selectOffice}
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
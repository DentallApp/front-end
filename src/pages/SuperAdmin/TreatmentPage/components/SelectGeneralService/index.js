import { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { getGeneralTreatmentName } from 'services/GeneralTreatments';
import styles from './SelectGeneralService.module.css';

const SelectGeneralService = (
    {
        storeTreatments, 
        setFilterTreatments, 
        serviceSelected, 
        setServiceSelected,
        setDataTreatments
    }) => {

    const [generalTreatments, setGeneralTreatments] = useState(null);

    useEffect(() => {
        getGeneralTreatmentName()
            .then(res => setGeneralTreatments(res.data))
            .catch(err => err);
        setServiceSelected(0);  
        // eslint-disable-next-line react-hooks/exhaustive-deps      
    }, []);

    const handleChange = (e) => {
        setServiceSelected(e.target.value);
        if(parseInt(e.target.value) !== 0) {
            const filterData = storeTreatments.filter(treatment => treatment.generalTreatmentId === parseInt(e.target.value));
            setFilterTreatments(filterData);
            setDataTreatments(filterData);
            return;
        }
        setDataTreatments(storeTreatments);
        setFilterTreatments(storeTreatments);
    }

    return (
        <Form className={styles.container_form}>
            <Row>
                <Col sm={12}>
                    <Form.Group className="mb-3" controlId="formBasicService">
                        <Form.Label className={styles.label_input}>Servicios</Form.Label>
                        <Form.Select
                        name="serviceId"
                        onChange={handleChange}
                        value={serviceSelected !== null && serviceSelected}
                        >
                        <option  
                        value='0'>
                            Todos
                        </option>    
                        { generalTreatments && (
                            generalTreatments.map(data => (
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

export default SelectGeneralService;
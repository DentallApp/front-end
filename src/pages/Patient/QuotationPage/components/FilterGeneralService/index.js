import { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { getGeneralTreatmentName } from 'services/GeneralTreatments';
import styles from './FilterGeneralService.module.css';

const FilterGeneralService = ({
    dataTreatments, 
    setFilterTreatments, 
    valueSelected,
    setValueSelected, 
    setSelectedGeneralTreatments}) => {

    const [generalTreatments, setGeneralTreatments] = useState(null);

    useEffect(() => {
        getGeneralTreatmentName()
            .then(res => setGeneralTreatments(res.data))
            .catch(err => err);
        setValueSelected(0);      
        // eslint-disable-next-line react-hooks/exhaustive-deps   
    }, []);

    const handleChange = (e) => {
        setValueSelected(e.target.value);
        if(parseInt(e.target.value) !== 0) {
            const filterData = dataTreatments.filter(treatment => 
                treatment.generalTreatmentId === parseInt(e.target.value));
            setFilterTreatments(filterData);
            setSelectedGeneralTreatments(filterData);
            return;
        }
        setSelectedGeneralTreatments(dataTreatments);
        setFilterTreatments(dataTreatments);
    }

    return (
        <Form className={styles.container_form}>
            <Row>
                <Col lg={12} md>
                    <Form.Group className="mb-3" controlId="formBasicOffice">
                        <Form.Label className={styles.label_input}>Servicios</Form.Label>
                        <Form.Select
                        name="officeId"
                        onChange={handleChange}
                        value={valueSelected !== null && valueSelected}
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

export default FilterGeneralService;
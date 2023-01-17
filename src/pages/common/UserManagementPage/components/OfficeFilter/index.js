import { useState, useEffect } from 'react';
import { Form, Row } from 'react-bootstrap';
import Select from 'react-select';
import { getOffices } from 'services/OfficeService';
import styles from './OfficeFilter.module.css';

const OfficeFilter = (
    {
        officeSelected,
        setOfficeSelected,
        handleChangeOffice
    }) => {

    const [offices, setOffices] = useState(null);

    useEffect(() => {
        getOffices()
            .then(res => setOffices(res.data))
            .catch(err => err); 
        // eslint-disable-next-line react-hooks/exhaustive-deps      
    }, []);

    return (
        <Form className={`${styles.container_form} mb-3`}>
            <Row>
            <Form.Label className={styles.label_input}>Consultorios</Form.Label>
                <Select
                style={{"minWidth": "80% !important"}}
                defaultValue={{
                    value: 0, 
                    label: 'Todos' 
                }}
                name="dentists"
                options={ 
                    offices && [{value: 0, label: 'Todos'}, ...offices.map(data => {
                        return {
                            value: data.id, 
                            label: data.name
                        }
                })]}
                value={officeSelected}
                onChange={handleChangeOffice} />
            </Row>
        </Form>
    );
}

export default OfficeFilter;
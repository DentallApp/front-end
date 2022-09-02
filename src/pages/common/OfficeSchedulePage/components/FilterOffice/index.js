import Select from 'react-select';
import { Form, Row } from 'react-bootstrap';
import styles from './FilterOffice.module.css';

const FilterOffice = ({offices, handleSelectOffice}) => {

    return (
        <>
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
                    })] }
                    onChange={handleSelectOffice}
                    />
            </Row>             
        </>
    );
}

export default FilterOffice;
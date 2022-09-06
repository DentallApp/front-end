import Select from 'react-select';
import { Form, Row } from 'react-bootstrap';
import styles from './FilterDentist.module.css';

const FilterDentist = ({dentists, handleSelectDentist }) => {

    return (
        <>
            <Row style={{'width':'100%'}}>
                <Form.Label className={styles.label_input}>Odontólogos</Form.Label>
                    <Select
                    style={{"minWidth": "80% !important"}}
                    defaultValue={{
                        value: 0, 
                        label: 'Todos' 
                    }}
                    name="dentists"
                    options={ 
                        dentists && [{value: 0, label: 'Todos'}, ...dentists.map(data => {
                            return {
                                value: data.employeeId, 
                                label: data.fullName
                            }
                    })] }
                    onChange={handleSelectDentist}
                    />
            </Row>             
        </>
    );
}

export default FilterDentist;
import Select from 'react-select';
import { Form, Row } from 'react-bootstrap';
import styles from './FilterDentist.module.css';

const FilterDentist = ({dentists, handleSelectDentist }) => {

    return (
        <>
            <Row>
                <Form.Label className={styles.label_input}>Odontólogos</Form.Label>
                    <Select
                    style={{'maxWidth': '80%'}}
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
                        })] 
                    }
                    onChange={handleSelectDentist}
                    />
            </Row>             
        </>
    );
}

export default FilterDentist;
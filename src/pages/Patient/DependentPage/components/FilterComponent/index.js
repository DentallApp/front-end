import { Button, InputGroup, Form } from 'react-bootstrap';
import styles from './FilterComponent.module.css';

const FilterComponent = ({ filterText, onFilter, onClear, setFilterText }) => {
    return (
        <Form.Group className={styles.filter} controlId="formBasic">
                <InputGroup>
                    <Form.Control
                    className={styles.filter_input}
                    type="text" 
                    placeholder="Ingrese texto a buscar"
                    value={filterText}
                    onChange={onFilter} />   
                    <Button className={styles.button_clear} onClick={onClear}>X</Button>
                </InputGroup>
        </Form.Group>
    );
}

export default FilterComponent;
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import FilterDentist from '../FilterDentist';
import styles from './Filters.module.css';

const Filters = () => {
    return (
        <>
            <Row style={{'width':'100%'}}>
                <Col sm={12} lg={6}>
                    <Row style={{'width':'100%'}}>
                        <Col sm={4} lg={6} md>
                            <Form.Label className={styles.label_input}>Desde</Form.Label>
                            <Form.Control 
                            type="date"
                            />
                        </Col>
                        <Col sm={4} lg={6} md>
                            <Form.Label className={styles.label_input}>Hasta</Form.Label>
                            <Form.Control 
                            type="date"
                            />
                        </Col>
                    </Row>
                </Col>
                <Col sm={12} lg={6}>
                    <FilterDentist />
                </Col>
            </Row>
        </>
    );
}

export default Filters;
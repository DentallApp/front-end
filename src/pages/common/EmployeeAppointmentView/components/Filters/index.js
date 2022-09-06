import { Form, Button, Row, Col } from 'react-bootstrap';
import { BsSearch } from "react-icons/bs";
import FilterDentist from '../FilterDentist';
import styles from './Filters.module.css';

const Filters = () => {
    return (
        <>
            <Form style={{'width':'100%'}}>
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
                <Row className="mt-3">
                    <div className={styles.container_button}>
                        <Button className={styles.btn_search}>
                            <BsSearch /> Consultar
                        </Button>
                    </div>
                </Row>
            </Form>
        </>
    );
}

export default Filters;
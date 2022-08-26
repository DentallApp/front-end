import { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import styles from './FilterDentist.module.css';

const dataDentists = [
    {id: 1, name: 'Fernanda Galarza Hurtado'},
    {id: 2, name: 'Luis Rodirguez Cevallos'},
    {id: 3, name: 'Camila Jimenez Luna'},
    {id: 4, name: 'Gabriela Palacio Nuñez'},
    {id: 5, name: 'Juan Ponce Hernandez'}
];

const FilterDentist = ({setDentistSelected}) => {

    const [dentists, setDentists] = useState(dataDentists);

    useEffect(() => {
        setDentists(dataDentists);
    }, []);

    const handleChange = (e) => {
        setDentistSelected(e.target.value);
        console.log(e.target.value);
    }

    return (
        <Form className={styles.container_form}>
            <Row>
                <Col sm={12} lg={5}>
                    <Form.Group className="mb-3" controlId="formBasicDentist">
                        <Form.Label className={styles.label_input}>Odontólogos</Form.Label>
                        <Form.Select
                        name="dentist"
                        onChange={handleChange}
                        >
                        <option  
                        value='0'>
                            Seleccione
                        </option>    
                        { dentists && (
                            dentists.map(data => (
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

export default FilterDentist;
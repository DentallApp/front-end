import { useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { BsSearch } from "react-icons/bs";
import styles from './Filters.module.css';

const Filters = ({startDate, endDate, searchAppointments, minDate=''}) => {

    const { register, handleSubmit, setValue, watch, setError,  formState: {errors} } = useForm({
        defaultValues: {
            startDate: startDate,
            endDate: endDate
        }
    });
    
    const startDateValue = watch("startDate");
    const endDateValue = watch("endDate");

    useEffect(() => {
        setValue("startDate", startDate, true);
        setValue("endDate", endDate, true);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startDateChange = (e) => setValue('startDate', e.target.value, true);
    const endDateChange = (e) => setValue('endDate', e.target.value, true);

    return (
        <>
            <Form 
            style={{'width':'100%'}}
            onSubmit={handleSubmit((data) => {searchAppointments(data, setError)})}>
                <Row style={{'width':'100%'}}>
                    <Col 
                    lg={12}>
                        <Row style={{'width':'100%'}}>
                            <Col sm={4} lg={6} md>
                                <Form.Label className={styles.label_input}>Desde</Form.Label>
                                <Form.Control 
                                type="date"
                                min={minDate}
                                value={startDateValue}
                                onChange={startDateChange}
                                {...register("startDate", {required: 'Fecha es requerida'})}
                                />
                                { errors.startDate && <p className={styles.error_message}>{ errors.startDate.message }</p> }
                            </Col>
                            <Col sm={4} lg={6} md>
                                <Form.Label className={styles.label_input}>Hasta</Form.Label>
                                <Form.Control 
                                type="date"
                                min={minDate}
                                value={endDateValue}
                                onChange={endDateChange}
                                {...register("endDate", {required: 'Fecha es requerida'})}
                                />
                                { errors.endDate && <p className={styles.error_message}>{ errors.endDate.message }</p> }
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{'width': '100%'}} className="mt-3">
                    <div className={styles.container_button}>
                        <Button 
                        className={styles.btn_search}
                        type="submit">
                            <BsSearch /> Consultar
                        </Button>
                    </div>
                </Row>
                
            </Form>
        </>
    );
}

export default Filters;
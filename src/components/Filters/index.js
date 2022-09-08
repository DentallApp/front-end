import { useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { BsSearch } from "react-icons/bs";
import FilterDentist from 'components/FilterDentist';
import ROLES from 'constants/Roles';
import { getLocalUser } from 'services/UserService';
import styles from './Filters.module.css';

const Filters = ({startDate, endDate, dentists, handleSelectDentist, searchAppointments}) => {

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
                    sm={12} 
                    lg={ getLocalUser().roles.includes(ROLES.SECRETARY) ||
                        getLocalUser().roles.includes(ROLES.ADMIN) ? 6 : 12
                    }>
                        <Row style={{'width':'100%'}}>
                            <Col sm={4} lg={6} md>
                                <Form.Label className={styles.label_input}>Desde</Form.Label>
                                <Form.Control 
                                type="date"
                                value={startDateValue}
                                onChange={startDateChange}
                                {...register("startDate")}
                                />
                                { errors.startDate && <p className={styles.error_message}>{ errors.startDate.message }</p> }
                            </Col>
                            <Col sm={4} lg={6} md>
                                <Form.Label className={styles.label_input}>Hasta</Form.Label>
                                <Form.Control 
                                type="date"
                                value={endDateValue}
                                onChange={endDateChange}
                                {...register("endDate")}
                                />
                                { errors.endDate && <p className={styles.error_message}>{ errors.endDate.message }</p> }
                            </Col>
                        </Row>
                    </Col>
                    {
                        getLocalUser().roles.includes(ROLES.SECRETARY) ||
                        getLocalUser().roles.includes(ROLES.ADMIN)  ? (
                            <Col sm={12} lg={6}>
                                <FilterDentist
                                dentists={dentists}
                                handleSelectDentist={handleSelectDentist} 
                                />
                            </Col>
                        ):<></>
                    }
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
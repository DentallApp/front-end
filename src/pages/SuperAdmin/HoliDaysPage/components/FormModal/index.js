import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { useWindowWidth } from '@react-hook/window-size';
import moment from 'moment';
import { getOffices } from 'services/OfficeService'; 
import "react-datepicker/dist/react-datepicker.css";  
import styles from './FormModal.module.css';

const FormModal = ({
    show, 
    handleClose, 
    holidaySelect = null, 
    saveHoliday
}) => {

    const onlyWidth = useWindowWidth(); // Se obtiene ancho y altura de pantalla para colocar el modal
    const [type, setType] = useState('create');
    const [offices, setOffices] = useState(null);
    const [startDate, setStartDate] = useState(holidaySelect !== null ? 
        moment(`2022-${holidaySelect.date}`).toDate() : 
        new Date());
    const days = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const locale = {
        localize: {
            day: n => days[n],
            month: n => months[n]
        },
        formatLong: {
            date: () => 'dd/MM/yyyy'
        }
    }

    const { register, handleSubmit, reset, setValue, watch, formState: {errors} } = useForm({
        defaultValues: {
            holidayId: `${ holidaySelect !== null ? holidaySelect.id : ""}`,
            date: `${ holidaySelect !== null ? holidaySelect.date : ""}`,
            description: `${ holidaySelect !== null ? holidaySelect.description : ""}`,
            officeId: `${ holidaySelect !== null ? holidaySelect.officeId : ""}`,
        }
    });

    const dateValue = watch("date");

    useEffect(() => {
        getOffices().then(response => setOffices(response.data))
            .catch(error => error);

        register("officeId", { required: "Consultorio es requerido" });   

        if(holidaySelect !== null) {
            setValue("officeId", holidaySelect.officeId, true);
            setType('edit');
            
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps      
    }, []);

    const handleSelectOffice = (e) => setValue("officeId", e.value, true);

    const handleDate = (date) => {
        setStartDate(date);
        setValue('date', moment(date).format('MM-DD', true));
    }
    

    return (
        <Modal 
        show={show} 
        onHide={handleClose} 
        dialogClassName={styles.container_modal}
        aria-labelledby="example-custom-modal-styling-title"
        fullscreen={ onlyWidth < 768 ? true : false} 
        >
            <Modal.Header className={styles.container_header} closeButton>
                <Modal.Title>{ holidaySelect === null ? 'Registrar nuevo feriado' : 'Editar feriado' }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form 
                className={styles.container_form} 
                onSubmit={handleSubmit((data) => saveHoliday(data, reset, type))}>
                    <h2>Registro</h2>
                    <div className="underline mx-auto"></div>
                    <p className={styles.text_information}>Los campos con el símbolo * son obligatorios</p>
                    <Container>
                        <Row>
                            <Col xs={12} md>
                                <Form.Group className="mb-3" controlId="formBasicDate">
                                    <Form.Label className={styles.label_input}>* Fecha</Form.Label>
                                    <DatePicker
                                    className="form-control"
                                    locale={locale}
                                    placeholderText="Seleccione una fecha"
                                    selected={startDate}
                                    onChange={(date) => handleDate(date)} 
                                    dateFormat="dd/MM"
                                    minDate={new Date(`01-01-${new Date().getFullYear()}`)}
                                    maxDate={new Date(`12-31-${new Date().getFullYear()}`)}
                                    renderCustomHeader={({
                                        date,
                                        decreaseMonth,
                                        increaseMonth,
                                        prevMonthButtonDisabled,
                                        nextMonthButtonDisabled,
                                      }) => (
                                        <div
                                          style={{
                                            margin: 10,
                                          }}
                                        >
                                          <Button
                                          className="react-datepicker__navigation react-datepicker__navigation--previous" 
                                          style={{
                                            marginTop: 15
                                          }}
                                          onClick={decreaseMonth} 
                                          disabled={prevMonthButtonDisabled}>
                                            <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--previous">
                                                Previous Month
                                            </span>
                                          </Button>
                                          
                                          <div className="react-datepicker__current-month">
                                            { months[date.getMonth()]}
                                          </div>
                                
                                          <button 
                                          className="react-datepicker__navigation react-datepicker__navigation--next"
                                          style={{
                                            marginTop: 15
                                          }}
                                          onClick={increaseMonth} 
                                          disabled={nextMonthButtonDisabled}>
                                            <span 
                                            className='react-datepicker__navigation-icon react-datepicker__navigation-icon--next'>
                                                Next Month
                                            </span>
                                          </button>
                                        </div>
                                      )}
                                    />
                                    { errors.date && <p className={styles.error_message}>{ errors.date.message }</p> } 
                                </Form.Group>
                            </Col>

                            <Col xs={12} md>
                                <Form.Group className="mb-3" controlId="formBasicOffice">
                                    <Form.Label className={styles.label_input}>* Consultorio</Form.Label>
                                    <Select
                                    name="office"
                                    placeholder="Seleccione"
                                    defaultValue={
                                        holidaySelect !== null && 
                                            {
                                                value: holidaySelect.officeId, 
                                                label: holidaySelect.office
                                            }
                                    }
                                    options={ 
                                        offices && offices.map(data => {
                                            return {
                                                value: data.id, 
                                                label: data.name
                                            }
                                        })
                                    }
                                    onChange={handleSelectOffice}
                                    />
                                    { errors.officeId && <p className={styles.error_message}>{ errors.officeId.message }</p> }
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col xs={12} md>
                                <Form.Group className="mb-3" controlId="formBasicDescription">
                                    <Form.Label className={styles.label_input}>* Descripción</Form.Label>
                                    <Form.Control as="textarea" rows={5}
                                    placeholder="Ingrese descripción del feriado"
                                    {...register("description", {
                                        required: "Descripción del feriado es requerido",
                                        minLength: {
                                            value: 5,
                                            message: "Descripción no válida" 
                                        }
                                    })} /> 
                                    { errors.description && <p className={styles.error_message}>{ errors.description.message }</p> } 
                                </Form.Group>
                            </Col>
                        </Row>                        
                    </Container>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cerrar
                        </Button>
                        <Button variant="primary" type="submit">
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
      </Modal>
    );
}

export default FormModal;
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
        moment(`${new Date().getFullYear()}-${holidaySelect.month}-${holidaySelect.day}`).toDate() : 
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

    const { register, handleSubmit, reset, setValue, setError, clearErrors, formState: {errors} } = useForm({
        defaultValues: {
            id: `${ holidaySelect !== null ? holidaySelect.id : ""}`,
            day: `${ holidaySelect !== null ? holidaySelect.day : ""}`,
            month: `${ holidaySelect !== null ? holidaySelect.month : ""}`,
            description: `${ holidaySelect !== null ? holidaySelect.description : ""}`,
            officeId: `${ holidaySelect !== null ? holidaySelect.offices : ""}`,
        }
    });

    useEffect(() => {
        getOffices().then(response => setOffices(response.data))
            .catch(error => error);

        register("officeId", { required: "Consultorio es requerido" });   
        setValue('date', moment(startDate).format('DD-MM', true));

        if(holidaySelect !== null) {
            setValue("date", moment(`2022-${holidaySelect.month}-${holidaySelect.day}`).format('DD-MM', true), true);
            setValue("officeId", holidaySelect.offices, true);
            setType('edit');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps      
    }, []);

    const handleSelectOffice = (e) => {
        clearErrors('date'); 
        setValue("officeId", e.map(office => {return {
            id: parseInt(e.value),
            name: e.label
        }}), true);
    }

    const handleDate = (date) => {
        setStartDate(date);
        setValue('date', moment(date).format('DD-MM', true));
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
                onSubmit={handleSubmit((data) => saveHoliday(data, reset, type, setError))}>
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
                                        holidaySelect.offices.map(office => {
                                            return {
                                                value: office.id, 
                                                label: office.name
                                            }
                                        })
                                    }
                                    options={ 
                                        offices !==  null && offices.map(data => {
                                            return {
                                                value: data.id, 
                                                label: data.name
                                            }
                                        })
                                    }
                                    isMulti
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
import { useEffect, useState, useRef } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import moment from 'moment';
import { BsSearch } from "react-icons/bs";
import { getLocalUser } from 'services/UserService';
import { getDentistByOffice } from 'services/EmployeeService';
import ROLES from 'constants/Roles';
import styles from './Filters.module.css';

const Filters = ({
    offices, 
    searchAppointments, 
    setStartDate, 
    setEndDate, 
    setSelectOffice, 
    setSelectDentist
}) => {

    const { register, handleSubmit, setValue, watch, setError,  formState: {errors} } = useForm({
        defaultValues: {
            from: moment().format('yyyy-MM-DD'),
            to: moment().format('yyyy-MM-DD'),
        }
    });

    const selectDentistRef = useRef();
    const [dentists, setDentists] = useState(null);

    const fromValue = watch("from");
    const toValue = watch("to");
    const selectOffice = watch("officeId");

    useEffect(() => {
        register('officeId', {
            required: 'Consultorio es requerido'
        });

        register('dentistId', {
            required: 'El odontólogo es requerido'
        });

        register('from', {
            required: 'Fecha de inicio es requerida'
        });

        register('to', {
            required: 'Fecha final es requerida'
        });

        setStartDate(fromValue);
        setEndDate(toValue);

        if(getLocalUser().roles.includes(ROLES.SUPERADMIN) === false) { 
            setValue('officeId', getLocalUser().officeId, true);

            setSelectOffice({value: getLocalUser().officeId, label: getLocalUser().officeName});

            getDentistByOffice(getLocalUser().officeId, null)
                .then(res => setDentists(res.data.data))
                .catch(err => err);
        }        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Se invoca cada vez que se cambia la selección hecha en el combobox de consultorio
    useEffect(() => {
        if(selectOffice !== '' && selectOffice !== undefined && getLocalUser().roles.includes(ROLES.SUPERADMIN)) {
            
            // Se verifica si ya había seleccionado un odontologo en su respectivo combobox
            // de ser así se resetea el combobox
            if(selectDentistRef.current !== null && selectDentistRef.current !== undefined) {
                setValue('dentistId', 0, true);
                selectDentistRef.current.setValue({value: 0, label: 'Todos'});
            }
            
            getDentistByOffice(selectOffice, null).then(res => setDentists(res.data.data))
                .catch(err => err);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, [selectOffice]);

    const fromChange = (e) => {
        setValue('from', e.target.value, true);
        setStartDate(e.target.value);
    }    
    const toChange = (e) => {
        setValue('to', e.target.value, true);
        setEndDate(e.target.value);
    }    

    const handleOffice = (e) => {
        setValue('officeId', parseInt(e.value), true);
        setSelectOffice(e);
    }    

    const handleDentist = (e) => {
        if(e !== null && e !== undefined) {
            setSelectDentist(e);
            setValue('dentistId', parseInt(e.value), true);
        }    
    } 

    return (
        <>
            <Form 
            style={{'width':'100%'}}
            onSubmit={handleSubmit((data) => {searchAppointments(data, setError)})}>
                <Row style={{'width':'100%', 'margin': '0'}}>
                    <Col 
                    lg={12}>
                        <Row style={{'width':'100%'}}>
                            <Col 
                            xs={12}
                            sm={6} 
                            md={getLocalUser().roles.includes(ROLES.SUPERADMIN) ? 3 : 4} 
                            lg={getLocalUser().roles.includes(ROLES.SUPERADMIN) ? 3 : 4} 
                            className='mb-2'>
                                <Form.Label className={styles.label_input}>Desde</Form.Label>
                                <Form.Control 
                                type="date"
                                value={fromValue}
                                max={moment().format('yyyy-MM-DD')}
                                onChange={fromChange}
                                />
                                { errors.from && <p className={styles.error_message}>{ errors.from.message }</p> }
                            </Col>
                            <Col 
                            xs={12}
                            sm={6} 
                            md={getLocalUser().roles.includes(ROLES.SUPERADMIN) ? 3 : 4} 
                            lg={getLocalUser().roles.includes(ROLES.SUPERADMIN) ? 3 : 4} 
                            className='mb-2'>
                                <Form.Label className={styles.label_input}>Hasta</Form.Label>
                                <Form.Control 
                                type="date"
                                max={moment().format('yyyy-MM-DD')}
                                value={toValue}
                                onChange={toChange}
                                />
                                { errors.to && <p className={styles.error_message}>{ errors.to.message }</p> }
                            </Col>
                            
                                {
                                    getLocalUser().roles.includes(ROLES.SUPERADMIN) && (
                                        <>
                                            <Col 
                                            xs={12}
                                            sm={6} 
                                            md={3} 
                                            lg={3} 
                                            className='mb-2'>
                                                <Form.Label className={styles.label_input}>Consultorios</Form.Label>
                                                <Select
                                                placeholder={'Seleccione'}
                                                onChange={handleOffice}
                                                options={(offices !== null && offices !== undefined) && 
                                                    [{value: 0, label: 'Todos'}, ...offices.map(office => {
                                                        return {
                                                            value: office.id,
                                                            label: office.name
                                                        }
                                                    })]
                                                }
                                                />
                                                { errors.officeId && <p className={styles.error_message}>{ errors.officeId.message }</p> }
                                            </Col>
                                        </>
                                    )
                                }
                            <Col 
                            xs={12}
                            sm={6}  
                            md={getLocalUser().roles.includes(ROLES.SUPERADMIN) ? 3 : 4} 
                            lg={getLocalUser().roles.includes(ROLES.SUPERADMIN) ? 3 : 4} 
                            className='mb-2'>
                                <Form.Label className={styles.label_input}>Odontólogos</Form.Label>
                                {
                                    selectOffice === '' || selectOffice === undefined ? (
                                        <Select 
                                        placeholder={'Seleccione'}
                                        isDisabled={true}
                                        />
                                    ):(
                                        <>
                                            { 
                                                dentists ? (
                                                    <>
                                                        <Select
                                                        ref={selectDentistRef}
                                                        options={dentists !== null && [
                                                            {value: 0, label: 'Todos'}, ...dentists.map(dentist => {
                                                            return {
                                                                value: dentist.employeeId,
                                                                label: dentist.fullName
                                                            }
                                                        })]}
                                                        placeholder={'Seleccione'}
                                                        onChange={handleDentist}
                                                        isDisabled={selectOffice === '' ? true : false}
                                                        components={<p>No hay opciones disponibles</p>}
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        />
                                                        { 
                                                            errors.dentistId && <p className={styles.error_message}>
                                                                { errors.dentistId.message }
                                                            </p> 
                                                        }
                                                    </>
                                                ): (
                                                    <p style={{'textAlign': 'center'}}>Cargando...</p>
                                                )
                                            }
                                        </>
                                    )
                                }
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
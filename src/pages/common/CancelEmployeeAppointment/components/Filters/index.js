import { useEffect, useState, useRef } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import moment from 'moment';
import { BsSearch } from "react-icons/bs";
import { getLocalUser } from 'services/UserService';
import { getDentistByOffice } from 'services/EmployeeService';
import {  getOfficesActiveAndInactive } from 'services/OfficeService';
import ROLES from 'constants/Roles';
import styles from './Filters.module.css';

const Filters = ({searchAppointments, setSelectDentist, setSelectOffice}) => {

    const { register, handleSubmit, setValue, watch, setError,  formState: {errors} } = useForm({
        defaultValues: {
            from: moment().format('yyyy-MM-DD'),
            to: moment().format('yyyy-MM-DD'),
        }
    });

    const selectDentistRef = useRef();
    const [dentists, setDentists] = useState(null);
    const [offices, setOffices] = useState(null);

    const fromValue = watch("from");
    const toValue = watch("to");
    const selectOffice = watch("officeId");


    useEffect(() => {
        register('from', {
            required: 'Fecha de inicio es requerida'
        });

        register('to', {
            required: 'Fecha final es requerida'
        });

        register('officeId', {
            required: 'Consultorio es requerido'
        });

        register('dentistId', {
            required: 'El odontólogo es requerido'
        });

        setValue('officeId', 0, true);
        setValue('dentistId', 0, true);

        if(getLocalUser().roles.includes(ROLES.SUPERADMIN) === false) { 
            setValue('officeId', getLocalUser().officeId, true);
            setSelectOffice(getLocalUser().officeId);
            setSelectDentist(0);

            getDentistByOffice(getLocalUser().officeId, null)
                .then(res => setDentists(res.data.data))
                .catch(err => err);
        }

        if(getLocalUser().roles.includes(ROLES.SECRETARY) === false && 
        getLocalUser().roles.includes(ROLES.ADMIN) === false && 
        getLocalUser().roles.includes(ROLES.SUPERADMIN) === false) { 
            setValue('dentistId', getLocalUser().employeeId, true);
            setSelectDentist(getLocalUser().employeeId)
        }
        
        if(getLocalUser().roles.includes(ROLES.SUPERADMIN)) { 
            setSelectOffice(0);
            setSelectDentist(0);
            
            getOfficesActiveAndInactive()
                .then(res => setOffices(res.data))
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
    }    
    const toChange = (e) => {
        setValue('to', e.target.value, true);
    }    

    const handleOffice = (e) => setValue('officeId', e.value, true);

    const handleDentist = (e) => {
        if(e !== null && e !== undefined) {
            setValue('dentistId', e.value, true);
        }    
    } 

    return (
        <>
            <Form 
            style={{'width':'100%'}}
            onSubmit={handleSubmit((data) => {searchAppointments(data, setError)})}>
                <Row style={{'width':'100%', 'margin': '0', 'display': 'flex', 'justifyContent': 'center'}}>
                    <Col
                    xs={6}
                    md={
                        getLocalUser().roles.includes(ROLES.SUPERADMIN)  ? 3 : (
                            (getLocalUser().roles.includes(ROLES.ADMIN) || 
                            getLocalUser().roles.includes(ROLES.SECRETARY)) ? 4 : 6
                        )
                    } 
                    lg={
                        getLocalUser().roles.includes(ROLES.SUPERADMIN)  ? 3 : (
                            (getLocalUser().roles.includes(ROLES.ADMIN) || 
                            getLocalUser().roles.includes(ROLES.SECRETARY)) ? 4 : 6
                        )
                    } 
                    className='mb-2'>
                        <Form.Label className={styles.label_input}>Desde</Form.Label>
                        <Form.Control 
                        type="date"
                        min={moment().format('yyyy-MM-DD')}
                        value={fromValue}
                        onChange={fromChange}
                        />
                        { errors.from && <p className={styles.error_message}>{ errors.from.message }</p> }
                    </Col>
                    
                    <Col
                    xs={6}
                    md={
                        getLocalUser().roles.includes(ROLES.SUPERADMIN)  ? 3 : (
                            (getLocalUser().roles.includes(ROLES.ADMIN) || 
                            getLocalUser().roles.includes(ROLES.SECRETARY)) ? 4 : 6
                        )
                    } 
                    lg={
                        getLocalUser().roles.includes(ROLES.SUPERADMIN)  ? 3 : (
                            (getLocalUser().roles.includes(ROLES.ADMIN) || 
                            getLocalUser().roles.includes(ROLES.SECRETARY)) ? 4 : 6
                        )
                    } 
                    className='mb-2'>
                        <Form.Label className={styles.label_input}>Hasta</Form.Label>
                        <Form.Control 
                        type="date"
                        value={toValue}
                        min={moment().format('yyyy-MM-DD')}
                        onChange={toChange}
                        />
                        { errors.to && <p className={styles.error_message}>{ errors.to.message }</p> }
                    </Col>

                    {
                        getLocalUser().roles.includes(ROLES.SUPERADMIN) && (
                            <>
                                <Col 
                                xs={6}
                                md={
                                    getLocalUser().roles.includes(ROLES.SUPERADMIN)  ? 3 : (
                                        (getLocalUser().roles.includes(ROLES.ADMIN) || 
                                        getLocalUser().roles.includes(ROLES.SECRETARY)) ? 4 : 6
                                    )
                                } 
                                lg={
                                    getLocalUser().roles.includes(ROLES.SUPERADMIN)  ? 3 : (
                                        (getLocalUser().roles.includes(ROLES.ADMIN) || 
                                        getLocalUser().roles.includes(ROLES.SECRETARY)) ? 4 : 6
                                    )
                                } 
                                className='mb-2'>
                                    <Form.Label className={styles.label_input}>Consultorios</Form.Label>
                                    <Select
                                    placeholder={'Seleccione'}
                                    defaultValue={
                                        {
                                            value: 0,
                                            label: 'Todos'
                                        }
                                    }
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
                            
                    {
                        (getLocalUser().roles.includes(ROLES.SUPERADMIN) ||
                            getLocalUser().roles.includes(ROLES.ADMIN) || 
                            getLocalUser().roles.includes(ROLES.SECRETARY)) && (
                            <Col
                            xs={6}
                            md={
                                getLocalUser().roles.includes(ROLES.SUPERADMIN)  ? 3 : (
                                    (getLocalUser().roles.includes(ROLES.ADMIN) || 
                                    getLocalUser().roles.includes(ROLES.SECRETARY)) ? 4 : 6
                                )
                            } 
                            lg={
                                getLocalUser().roles.includes(ROLES.SUPERADMIN)  ? 3 : (
                                    (getLocalUser().roles.includes(ROLES.ADMIN) || 
                                    getLocalUser().roles.includes(ROLES.SECRETARY)) ? 4 : 6
                                )
                            } 
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
                                                            defaultValue={
                                                                {
                                                                    value: 0,
                                                                    label: 'Todos'
                                                                }
                                                            }
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
                        ) 
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
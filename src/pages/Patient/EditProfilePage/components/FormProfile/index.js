import { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { getGenders } from '../../../../../services/GenderService';
import { updateProfileUser, setLocalUser } from '../../../../../services/UserService';
import { trimSpaces, capitalizeFirstLetter } from '../../../../../utils/stringUtils';
import { 
    formatNames, 
    formatPhone } from '../../../../../utils/formatUtils';
import styles from './FormProfile.module.css';

const FormProfile = ({user, setIsLoading, setAlert}) => {
    
    const [genders, setGenders] = useState(null);
    const { register, handleSubmit, setValue, formState: {errors} } = useForm();
    const [profile, setProfile] = useState(null);
    
        
    useEffect(() => {
        
        setProfile({
            names: user.names,
            lastNames: user.lastNames,
            document: user.document,
            userName: user.userName,
            genderId: user.genderId.toString(),
            cellPhone: user.cellPhone,
            dateBirth: moment(user.dateBirth).format('yyyy-MM-DD')
        })
        
        getGenders()
            .then(response => setGenders(response.data))
            .catch(error => console.error(error));
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        if(profile !== null) {
            setValue('names', profile.names);
            setValue('lastNames', profile.lastNames);
            setValue('document', profile.document);
            setValue('cellPhone', profile.cellPhone);
            setValue('userName', profile.userName);
            setValue('dateBirth', profile.dateBirth);
            setValue('genderId', profile.genderId.toString());
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile]);

    const updateProfile = async(data) => {
        setIsLoading({success: undefined});

        // Se elimina espacios innecesarios
        const sanitizedName = trimSpaces(data.names);
        const sanitizedLastName = trimSpaces(data.lastNames);

        // Se convierte a mayúscula la primer letra de cada palabra
        data.names = capitalizeFirstLetter(sanitizedName);
        data.lastNames = capitalizeFirstLetter(sanitizedLastName);
        data.genderId = parseInt(data.genderId);

        const result = await updateProfileUser(data);
        setAlert(result);
        setIsLoading({success: result.success});

        if(result.success === true) {
            user.names = data.names;
            user.lastNames = data.lastNames;
            user.cellPhone = data.cellPhone;
            user.dateBirth = data.dateBirth;
            user.genderId = data.genderId;

            setLocalUser(user);
            setProfile(data);
        }
    }

    return (
        <>
            <Form className={styles.container_form} onSubmit={handleSubmit((data) => updateProfile(data))}>
                <Container>
                    <Row>
                        <Col xs={12} md>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label className={styles.label_input}>Nombre</Form.Label>
                                <Form.Control 
                                placeholder="Ingrese nombre"
                                {...register("names", {
                                    required: "Nombre es requerido",
                                    pattern: {
                                        value: formatNames,
                                        message: "Nombre no válido"
                                    },
                                    minLength: {
                                        value: 2,
                                        message: "Nombre no válido" 
                                    }
                                })} /> 
                                { errors.names && <p className={styles.error_message}>{ errors.names.message }</p> } 
                            </Form.Group>
                        </Col>

                        <Col xs={12} md>
                            <Form.Group className="mb-3" controlId="formBasicLastName">
                                <Form.Label className={styles.label_input}>Apellidos</Form.Label>
                                <Form.Control 
                                type="text" 
                                placeholder="Ingrese apellidos"
                                {...register("lastNames", {
                                    required: "Apellidos requeridos",
                                    pattern: {
                                        value: formatNames,
                                        message: "Apellidos no válidos"
                                    },
                                    minLength: 2
                                })} />
                                { errors.lastNames && <p className={styles.error_message}>{ errors.lastNames.message }</p> }
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} md>
                            <Form.Group className="mb-3" controlId="formBasicPhone">
                                <Form.Label className={styles.label_input}>Teléfono</Form.Label>
                                <Form.Control 
                                type="number" 
                                placeholder="Ingrese número de celular"
                                {...register("cellPhone", {
                                    required: "Número de celular requerido",
                                    pattern: {
                                        value: formatPhone,
                                        message: "Número de celular no válido"
                                    },
                                    minLength: {
                                        value: 10,
                                        message: "Número de celular debe de tener 10 dígitos"
                                    },
                                    maxLength: {
                                        value: 10,
                                        message: "Número de celular debe de tener 10 dígitos"
                                    }
                                })} />
                                { errors.cellPhone && <p className={styles.error_message}>{ errors.cellPhone.message }</p> } 
                            </Form.Group>
                        </Col>

                        <Col xs={12} md>
                            <Form.Group className="mb-3" controlId="formBasicId">
                                <Form.Label className={styles.label_input}>Cedula</Form.Label>
                                <Form.Control 
                                type="number"
                                disabled 
                                placeholder="Ingrese número de cedula"
                                {...register("document")} />
                                { errors.document && <p className={styles.error_message}>{ errors.document.message }</p> }
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} md>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label className={styles.label_input}>Correo</Form.Label>
                                <Form.Control 
                                type="email" 
                                placeholder="Ingrese correo electrónico"
                                disabled
                                {...register("userName")} />
                                { errors.userName && <p className={styles.error_message}>{ errors.userName.message }</p> }  
                            </Form.Group>
                        </Col>

                        <Col xs={12} md>
                            <Form.Group className="mb-3" controlId="formBasicDate">
                                <Form.Label className={styles.label_input}>Fecha de nacimiento</Form.Label>
                                <Form.Control 
                                type="date"
                                {...register("dateBirth", {
                                    required: "Fecha de nacimiento requerida"
                                })} />
                                { errors.dateBirth && <p className={styles.error_message}>{ errors.dateBirth.message }</p> }
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} md>
                            <Form.Group className="mb-3" controlId="formBasicGender">
                                <Form.Label className={styles.label_input}>Género</Form.Label>
                                { genders && (
                                    genders.map(gender => (
                                        <Form.Check
                                        key={gender.id} 
                                        type="radio" 
                                        label={gender.name}
                                        id={gender.name}
                                        value={gender.id}
                                        name="gender"
                                        {...register("genderId", {required: "Género es requerido"})} />
                                    ))
                                ) }
                                { errors.genderId && <p className={styles.error_message}>{ errors.genderId.message }</p> }
                            </Form.Group>
                        </Col>
                    </Row>
                </Container>
                <div className={styles.container_button}>
                    <Button className={styles.button_sign_in} type="submit">
                        Guardar
                    </Button>
                </div>
            </Form>
        </>
    );
}

export default FormProfile;
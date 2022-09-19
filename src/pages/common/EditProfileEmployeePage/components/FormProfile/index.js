import { useEffect, useState, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { getGenders } from 'services/GenderService';
import { setLocalUser } from 'services/UserService';
import { updateProfileEmployee } from 'services/EmployeeService';
import { trimSpaces, capitalizeFirstLetter } from 'utils/stringUtils';
import { 
    formatNames, 
    formatPhone } from 'utils/formatUtils';    
import { handleErrors } from 'utils/handleErrors';
import CurrentUserNameContext from 'context/CurrentUserNameContext'; 
import styles from './FormProfile.module.css';

const FormProfile = ({user, setIsLoading, setAlert}) => {
    
    const [genders, setGenders] = useState(null);
    const { register, handleSubmit, setValue, formState: {errors} } = useForm();
    const [profile, setProfile] = useState(null);
    const { handleNames } = useContext(CurrentUserNameContext);
    
    useEffect(() => {
        
        setProfile({
            names: user.names,
            lastNames: user.lastNames,
            document: user.document,
            userName: user.userName,
            genderId: user.genderId.toString(),
            cellPhone: user.cellPhone,
            dateBirth: moment(user.dateBirth).format('yyyy-MM-DD'),
            pregradeUniversity: user.pregradeUniversity !== null ? user.pregradeUniversity : "",
            postgradeUniversity: user.postgradeUniversity !== null ? user.postgradeUniversity : ""
        })
        
        getGenders()
            .then(response => setGenders(response.data))
            .catch(error => error);
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
            setValue('pregradeUniversity', profile.pregradeUniversity);
            setValue('postgradeUniversity', profile.postgradeUniversity);
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

        const result = await updateProfileEmployee(data);
        setIsLoading({success: result.success});

        if(result.success === true) {
            result.message = 'Perfil actualizado exitosamente';
            user.names = data.names;
            user.lastNames = data.lastNames;
            user.fullName = data.names + ' ' + data.lastNames;
            user.cellPhone = data.cellPhone;
            user.dateBirth = data.dateBirth;
            user.genderId = data.genderId;
            user.pregradeUniversity = data.pregradeUniversity;
            user.postgradeUniversity = data.postgradeUniversity;

            genders.forEach(gender => {
                if(gender.id === user.genderId) {
                    user.genderName = gender.name;
                    return;
                }
            });

            setLocalUser(user);
            setProfile(data);
        }
        handleNames();
        setAlert(result);
        handleErrors(result, setAlert, setIsLoading);
    }

    return (
        <>
            <Form className={styles.container_form} onSubmit={handleSubmit((data) => updateProfile(data))}>
                <Container>
                    <Row>
                        <Col xs={12} md>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label className={styles.label_input}>* Nombre</Form.Label>
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
                                <Form.Label className={styles.label_input}>* Apellidos</Form.Label>
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
                                <Form.Label className={styles.label_input}>* Teléfono</Form.Label>
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
                                <Form.Label className={styles.label_input}>* Cedula</Form.Label>
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
                                <Form.Label className={styles.label_input}>* Correo</Form.Label>
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
                                <Form.Label className={styles.label_input}>* Fecha de nacimiento</Form.Label>
                                <Form.Control 
                                type="date"
                                max={moment().format('yyyy-MM-DD')}
                                {...register("dateBirth", {
                                    required: "Fecha de nacimiento requerida"
                                })} />
                                { errors.dateBirth && <p className={styles.error_message}>{ errors.dateBirth.message }</p> }
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg={12} md>
                            <Form.Group className="mb-3" controlId="formBasicPregradeUniversity">
                                <Form.Label className={styles.label_input}>Universidad pregrado</Form.Label>
                                <Form.Control 
                                placeholder="Ingrese universidad de pregrado"
                                {...register("pregradeUniversity", {
                                    minLength: {
                                        value: 2,
                                        message: "Nombre de universidad no válido" 
                                    }
                                })} /> 
                                { errors.pregrade_university && <p className={styles.error_message}>
                                    { errors.pregrade_university.message }</p> } 
                            </Form.Group>
                        </Col>

                        <Col xs={12} md>
                            <Form.Group className="mb-3" controlId="formBasicPostgradeUniversity">
                                <Form.Label className={styles.label_input}>Universidad postgrado</Form.Label>
                                <Form.Control 
                                type="text" 
                                placeholder="Ingrese universidad de prostgrado"
                                {...register("postgradeUniversity", {
                                    minLength: {
                                        value: 2,
                                        message: "Nombre de universidad no válido" 
                                    }
                                })} />
                                { errors.postgrade_university && <p className={styles.error_message}>
                                    { errors.postgrade_university.message }</p> }
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} md>
                            <Form.Group className="mb-3" controlId="formBasicGender">
                                <Form.Label className={styles.label_input}>* Género</Form.Label>
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
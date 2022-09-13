import { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { getGenders } from 'services/GenderService';
import { trimSpaces, capitalizeFirstLetter } from 'utils/stringUtils';
import { 
    formatNames, 
    formatPhone } from 'utils/formatUtils';
import { handleErrors } from 'utils/handleErrors';
import { verifyIdentityDocument } from 'utils/validationIdentityDocument'; 
import { createPerson } from 'services/PersonService'; 
import styles from './FormNewPatient.module.css';

const FormNewPatient = ({setIsLoading, setAlert}) => {
    
    const [genders, setGenders] = useState(null);
    const { register, handleSubmit, reset, setError, formState: {errors} } = useForm();
    
    useEffect(() => {
        getGenders()
            .then(response => setGenders(response.data))
            .catch(error => error);
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createPatient = async(data) => {

        const verifyDocument = verifyIdentityDocument(data.document);

        if(verifyDocument === false) {
            setError("document", {
                type: 'custom',
                message: 'Cedula de identidad no válida'
            });
            return;
        }

        setIsLoading({success: undefined});

        // Se elimina espacios innecesarios
        const sanitizedName = trimSpaces(data.names);
        const sanitizedLastName = trimSpaces(data.lastNames);

        // Se convierte a mayúscula la primer letra de cada palabra
        data.names = capitalizeFirstLetter(sanitizedName);
        data.lastNames = capitalizeFirstLetter(sanitizedLastName);
        data.genderId = parseInt(data.genderId);

        const result = await createPerson(data);

        if(result.success && result.success === true) result.message = 'Paciente creado con éxito';

        setAlert(result);
        setIsLoading({success: result.success});

        reset();
        handleErrors(result, setAlert, setIsLoading);
    }

    return (
        <>
            <Form className={styles.container_form} onSubmit={handleSubmit((data) => createPatient(data))}>
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
                                placeholder="Ingrese número de cedula"
                                {...register("document", {
                                    required: "Número de cedula es requerido"
                                })} />
                                { errors.document && <p className={styles.error_message}>{ errors.document.message }</p> }
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} md>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label className={styles.label_input}> Correo</Form.Label>
                                <Form.Control 
                                type="email" 
                                placeholder="Ingrese correo electrónico"
                                {...register("userName")} />
                                { errors.userName && <p className={styles.error_message}>{ errors.userName.message }</p> }  
                            </Form.Group>
                        </Col>

                        <Col xs={12} md>
                            <Form.Group className="mb-3" controlId="formBasicDate">
                                <Form.Label className={styles.label_input}> Fecha de nacimiento</Form.Label>
                                <Form.Control 
                                type="date"
                                {...register("dateBirth")} />
                                { errors.dateBirth && <p className={styles.error_message}>{ errors.dateBirth.message }</p> }
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

export default FormNewPatient;
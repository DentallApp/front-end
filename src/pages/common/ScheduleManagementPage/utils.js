export const validationScheduleMorning = (data, setError) => {
    let validation = true;

    if(((data.afternoonStartHour === '' && data.afternoonEndHour === '') || (data.afternoonStartHour === 'null' && data.afternoonEndHour === 'null')) 
    && ((data.morningStartHour === '' && data.morningEndHour === '') || (data.morningStartHour === 'null' && data.morningEndHour === 'null'))
    ) {
        setError("morningStartHour", {
            type: 'custom',
            message: 'Hora de inicio es requerida'
        });

        setError("morningEndHour", {
            type: 'custom',
            message: 'Hora fin es requerida'
        });
        validation = false;
    }

    if(data.morningStartHour > data.morningEndHour) {
        setError("morningStartHour", {
            type: 'custom',
            message: 'Hora de inicio no puede ser mayor a la hora fin'
        });

        setError("morningEndHour", {
            type: 'custom',
            message: 'Hora fin no puede ser menor a la hora de inicio'
        });
        validation = false;
    }

    if((data.morningStartHour !== '' && data.morningStartHour !== 'null') && data.morningEndHour === '')
    {
        setError("morningEndHour", {
            type: 'custom',
            message: 'Hora de fin es requerida'
        });
        return false;
    }

    if(data.morningStartHour === '' && (data.morningEndHour !== '' && data.morningEndHour !== 'null')) {
        setError("morningStartHour", {
            type: 'custom',
            message: 'Hora de inicio es requerida'
        });
        return false;
    }

    if((data.afternoonStartHour !== '' && data.afternoonEndHour !== '') && 
    (data.morningStartHour !== 'null' && data.morningEndHour !== 'null' && 
    data.afternoonStartHour !== 'null' && data.afternoonEndHour !== 'null') &&
    (data.morningStartHour > data.afternoonStartHour || 
        data.morningStartHour > data.afternoonEndHour
    )) {
        setError("morningStartHour", {
            type: 'custom',
            message: 'Hora de inicio no puede ser mayor al horario de la tarde'
        });
        validation = false;
    }

    if((data.afternoonStartHour !== '' && data.afternoonEndHour !== '') && 
    (data.morningStartHour !== 'null' && data.morningEndHour !== 'null' && 
    data.afternoonStartHour !== 'null' && data.afternoonEndHour !== 'null') &&
    (data.morningEndHour > data.afternoonStartHour || 
        data.morningEndHour > data.afternoonEndHour
    )) {
        setError("morningEndHour", {
            type: 'custom',
            message: 'Hora fin no puede ser mayor al horario de la tarde'
        });
        validation = false;
    }

    return validation;
}

export const validationScheduleAfternoon = (data, setError) => {
    let validation = true;

    if((data.afternoonStartHour !== '' && data.afternoonStartHour !== 'null') && data.afternoonEndHour === '') {
        setError("afternoonEndHour", {
            type: 'custom',
            message: 'Hora de fin es requerida'
        });
        return false;
    }

    if(data.afternoonStartHour === '' && (data.afternoonEndHour !== '' && data.afternoonEndHour !== 'null')) {
        setError("afternoonStartHour", {
            type: 'custom',
            message: 'Hora de inicio es requerida'
        });
        return false;
    }

    if(data.afternoonStartHour > data.afternoonEndHour) {
        setError("afternoonStartHour", {
            type: 'custom',
            message: 'Hora de inicio no puede ser mayor a la hora fin'
        });

        setError("afternoonEndHour", {
            type: 'custom',
            message: 'Hora fin no puede ser menor a la hora de inicio'
        });
        validation = false;
    }

    if((data.morningStartHour !== '' && data.morningEndtHour !== '' && data.afternoonStartHour !== '' && 
    data.afternoonEndtHour !== '') && 
    (data.morningStartHour !== 'null' && data.morningEndHour !== 'null' && data.afternoonStartHour !== 'null' && data.afternoonEndHour !== 'null') 
    && (data.afternoonStartHour < data.morningStartHour || data.afternoonStartHour < data.endTimeMorning)) {
        setError("afternoonStartHour", {
            type: 'custom',
            message: 'Hora de inicio de la tarde no puede ser menor al horario de la mañana'
        });
        validation = false;
    }

    if((data.morningStartHour !== '' && data.morningEndtHour !== '' && data.afternoonStartHour !== '' && 
    data.afternoonEndtHour !== '') && 
    (data.morningStartHour !== 'null' && data.morningEndHour !== 'null' && data.afternoonStartHour !== 'null' && data.afternoonEndHour !== 'null') 
    && (data.afternoonEndHour < data.morningStartHour || data.afternoonEndHour < data.endTimeMorning)) {
        setError("afternoonEndHour", {
            type: 'custom',
            message: 'Hora fin de la tarde no puede ser menor al horario de la mañana'
        });
        validation = false;
    }

    return validation;
}
export const validationScheduleMorning = (data, setError) => {
    let validation = true;

    if(data.startTimeMorning > data.endTimeMorning) {
        setError("startTimeMorning", {
            type: 'custom',
            message: 'Hora de inicio no puede ser mayor a la hora fin'
        });

        setError("endTimeMorning", {
            type: 'custom',
            message: 'Hora fin no puede ser menor a la hora de inicio'
        });
        validation = false;
    }

    return validation;
}

export const validationScheduleAfternoon = (data, setError) => {
    let validation = true;

    if(data.startTimeAfternoon === '' && data.endTimeAfternoon === '' ) return validation;

    if(data.startTimeAfternoon !== '' && data.endTimeAfternoon === '') {
        setError("endTimeAfternoon", {
            type: 'custom',
            message: 'Hora de fin es requerida'
        });
        return false;
    }

    if(data.startTimeAfternoon === '' && data.endTimeAfternoon !== '') {
        setError("startTimeAfternoon", {
            type: 'custom',
            message: 'Hora de inicio es requerida'
        });
        return false;
    }

    if(data.startTimeAfternoon > data.endTimeAfternoon) {
        setError("startTimeAfternoon", {
            type: 'custom',
            message: 'Hora de inicio no puede ser mayor a la hora fin'
        });

        setError("endTimeAfternoon", {
            type: 'custom',
            message: 'Hora fin no puede ser menor a la hora de inicio'
        });
        validation = false;
    }

    if(data.startTimeAfternoon < data.startTimeMorning || data.startTimeAfternoon < data.endTimeMorning) {
        setError("startTimeAfternoon", {
            type: 'custom',
            message: 'Hora de inicio de la tarde no puede ser menor al horario de la mañana'
        });
        validation = false;
    }

    if(data.endTimeAfternoon < data.startTimeMorning || data.endTimeAfternoon < data.endTimeMorning) {
        setError("endTimeAfternoon", {
            type: 'custom',
            message: 'Hora fin de la tarde no puede ser menor al horario de la mañana'
        });
        validation = false;
    }

    return validation;
}
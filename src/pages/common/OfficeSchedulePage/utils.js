export const validationSchedule = (data, setError) => {
    let validation = true;

    if(data.startHour > data.endHour) {
        setError("startHour", {
            type: 'custom',
            message: 'Hora de inicio no puede ser mayor a la hora fin'
        });

        setError("endHour", {
            type: 'custom',
            message: 'Hora fin no puede ser menor a la hora de inicio'
        });
        validation = false;
    }

    return validation;
}
export const validationSchedule = (data, setError) => {
    let validation = true;

    if(data.startTime > data.endTime) {
        setError("startTime", {
            type: 'custom',
            message: 'Hora de inicio no puede ser mayor a la hora fin'
        });

        setError("endTime", {
            type: 'custom',
            message: 'Hora fin no puede ser menor a la hora de inicio'
        });
        validation = false;
    }

    return validation;
}
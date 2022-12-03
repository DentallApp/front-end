export const setEventClassNames = (arg, styles) => {
    let stylesAppointments = [styles.container_event];
            
    if(arg.view.type === 'listDay') return;

    if(arg.view.type === 'dayGridMonth') stylesAppointments.concat(styles.center_text);
            
    switch(arg.event.extendedProps.status) {
        case 'Agendada':
            return stylesAppointments.concat(styles.scheduled);
        case 'Asistida':
            return stylesAppointments.concat(styles.assisted);
        case 'No Asistida':
            return stylesAppointments.concat(styles.unassisted);
        case 'Cancelada':
            return stylesAppointments.concat(styles.cancel);                
        default:
            return stylesAppointments;    
    }
}
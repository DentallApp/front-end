export const MinutesToHours = (totalMinutes) => {
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
}

export const HoursToMinutes = (time) => {
    const timeSplit = time.split(':');
    const hours = parseInt(timeSplit[0]) * 60;
    const minutes = parseInt(timeSplit[1]);
    const totalMinutes = hours + minutes;

    return totalMinutes;
}

const padTo2Digits = (num) => {
    return num.toString().padStart(2, '0');
}
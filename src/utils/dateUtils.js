export const calculatePreviousYear = (previous) => {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear() - previous;

    if (day < 10) day = '0' + day;
     
    if (month < 10) month = '0' + month; 

    let currentDate = `${year}-${month}-${day}`;
    return currentDate; 
}
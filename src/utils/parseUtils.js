// Reference: https://stackoverflow.com/a/12648710/14043783
export const parseBool = (str) => {
    if (typeof str === 'string' && str.toLowerCase() === 'true')
        return true;

    return (parseInt(str) > 0);
}
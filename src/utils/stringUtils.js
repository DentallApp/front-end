export const trimSpaces = (text) => {
    const result = text.split(/\s/);
    const sanitizeText = result.filter(character => character !== '');
    return sanitizeText.join(" ");
}

export const capitalizeFirstLetter = (text) => {
    const result = text.split(/\s/);
    const capitalizeText = result.map(element => element.charAt(0).toUpperCase() + element.substring(1).toLowerCase());
    return capitalizeText.join(" ");
}
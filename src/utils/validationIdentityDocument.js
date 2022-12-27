import { parseBool } from 'utils/parseUtils'

const verifyProvinceNumber = (ced) => {
    // Obtenemos el digito de la region que sonlos dos primeros digitos
    let digito_region = parseInt(ced.substring(0, 2));
  
    // Valido si la region existe en Ecuador, que se divide en 24 regiones
    // El 30 es asignado para ecuatorianos en el extranjero
    if ((digito_region >= 1 && digito_region <= 24) || digito_region === 30)
      return true;
    else return false;
};
  
export const verifyIdentityDocument = (ced) => {
    if(parseBool(process.env.REACT_APP_DISABLE_IDENTITY_VALIDATION)) 
      return true;

    const result = verifyProvinceNumber(ced);
  
    if (result === false) return false;
    
    // Extraigo el último dígito
    let verificationDigit = parseInt(ced.substring(9, 10));
  
    let num;
    let total = 0;
    let digit;
    let isOddPosition = false;
    let len = ced.length - 1;
  
    for (let i = 0; i !== len; ++i) {
      isOddPosition = !isOddPosition;
      num = isOddPosition === true  ? 2 : 1;
      total += (digit = ced.charAt(i) * num) > 9 ? digit - 9 : digit;
    }
  
    return (total % 10 === 0 && verificationDigit === 0) ||
      10 - (total % 10) === verificationDigit
      ? true
      : false;
  };
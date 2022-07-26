import axios from 'axios';

// Se configura la instancia de axios con la URL de la API a consumir y los headers
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


// Se congigura los interceptors


export default instance;
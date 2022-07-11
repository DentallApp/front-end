import axios from 'axios';

// Se configura la instancia de axios con la URL de la API a consumir y los headers
const instance = axios.create({
    baseURL: 'http://localhost:3978',
    headers: {
        "Content-Type": "application/json",
    },
});


// Se congigura los interceptors


export default instance;
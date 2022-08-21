import axios from 'axios';
import { 
  getLocalAccessToken, 
  getLocalRefreshToken, 
  updateLocalAccessToken, 
  updateLocalRefreshToken,
  removeLocalUser
} from './UserService';

const apiPublicRoutes = [
    "/login", 
    "/register/basic-user", 
    "/password-reset", 
    "/password-reset/send",
    "/email-verification",
    "/gender",
    "/general-treatment/:id"
];


// Se configura la instancia de axios con la URL de la API a consumir y los headers
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Se congigura los interceptors
instance.interceptors.request.use(
    (config) => {
        const token = getLocalAccessToken();

        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);


instance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
      if (apiPublicRoutes.includes(originalConfig.url) === false && err.response) {
        
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            const rs = await instance.post("/token/refresh", {
                accessToken: getLocalAccessToken(),
                refreshToken: getLocalRefreshToken()
            });
            const { accessToken, refreshToken } = rs.data.data;
            updateLocalAccessToken(accessToken);
            updateLocalRefreshToken(refreshToken);
            
            return instance(originalConfig);
          } catch (_error) {
            removeLocalUser();
            return Promise.reject(_error);
          }
        }
      }
  
      return Promise.reject(err);
    }
  );

export default instance;

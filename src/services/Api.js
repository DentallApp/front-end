import axios from 'axios';
import { 
  removeLocalUser
} from './UserService';

import { 
  getLocalAccessToken, 
  getLocalRefreshToken, 
  updateLocalAccessToken, 
  updateLocalRefreshToken,
  removeLocalAccessToken, 
  removeLocalRefreshToken 
} from './TokenService';

const apiPublicRoutes = [
    "/user/login", 
    "/user", 
    "/user/password-reset", 
    "/user/password-reset/send",
    "/user/email-verification",
    "/gender",
    "/general-treatment/:id"
];

// for multiple requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  })
  
  failedQueue = [];
}


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

  instance.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
  
    const originalRequest = error.config;
  
    if (error.response.status === 401 && !originalRequest._retry && 
      apiPublicRoutes.includes(originalRequest.url) === false) {
        
        if (isRefreshing) {
          return new Promise(function(resolve, reject) {
            failedQueue.push({resolve, reject})
          }).then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return instance(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          })
        }
  
      originalRequest._retry = true;
      isRefreshing = true;
  
      return new Promise(function (resolve, reject) {
        instance.post("/token/refresh", {
          oldAccessToken: getLocalAccessToken(),
          oldRefreshToken: getLocalRefreshToken()
        })
          .then(res => {
            updateLocalAccessToken(res.data.data.newAccessToken);
            updateLocalRefreshToken(res.data.data.newRefreshToken);
            instance.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.data.newAccessToken;
            originalRequest.headers['Authorization'] = 'Bearer ' + res.data.data.newAccessToken;
            processQueue(null, res.data.data.newAccessToken);
            resolve(axios(originalRequest));
          })
          .catch((err) => {
              processQueue(err, null);
              removeLocalAccessToken();
              removeLocalRefreshToken();
              removeLocalUser();
              reject(err);
          })
          .finally(() => { isRefreshing = false })
      })
    }
  
    return Promise.reject(error);
  });  

export default instance;

import axios from 'axios';
import https from 'https';

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
  });

export const HTTP = axios.create({
    baseURL: `${process.env.VUE_APP_API}api/v1/`,
    httpsAgent,
    headers: {
    }
})

HTTP.interceptors.request.use(function(config) {
    const token = process.env.VUE_APP_PUBLIC_API_KEY;
    config.headers.Authorization = localStorage.getItem('access_token') || token;

    return config;
});

export const HTTP_Store = axios.create({
    baseURL: `${process.env.VUE_APP_API}api/v2/`,
    httpsAgent,
    headers: {
        //"content-type": "multipart/form-data",
        //Authorization: 'Bearer 123456'
    }
})

HTTP_Store.interceptors.request.use(function(config) {
    const token = process.env.VUE_APP_PUBLIC_API_KEY;
    //config.headers.Authorization = localStorage.getItem('access_token');
    config.headers.Authorization = localStorage.getItem('access_token') || token;

    return config;
});

export const HTTP_Files = axios.create({
    baseURL: `${process.env.VUE_APP_API}api/back-images/`,
    httpsAgent,
    headers: {
        //"content-type": "multipart/form-data",
        //Authorization: 'Bearer 123456'
    }
})

HTTP_Files.interceptors.request.use(function(config) {
    const token = process.env.VUE_APP_PUBLIC_API_KEY;
    //config.headers.Authorization = localStorage.getItem('access_token');
    config.headers.Authorization = localStorage.getItem('access_token') || token;

    return config;
});
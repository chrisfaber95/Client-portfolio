import axios from 'axios';

export const HTTP = axios.create({
    baseURL: `${process.env.VUE_APP_API}api/`,
    headers: {
        //"content-type": "multipart/form-data",
        //Authorization: 'Bearer 123456'
    }
})

HTTP.interceptors.request.use(function(config) {
    const token = process.env.VUE_APP_PUBLIC_API_KEY;
    //config.headers.Authorization = localStorage.getItem('access_token');
    config.headers.Authorization = token;

    return config;
});
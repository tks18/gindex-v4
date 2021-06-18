import axios from 'axios';
import notify from '@/components/notification';
import router from '@/router';

const service = axios.create({
  baseURL: process.env.VUE_APP_API ? process.env.VUE_APP_API : '',
});

service.interceptors.request.use(
  (config) => config,
  (error) => {
    console.log(error);
    return Promise.reject(error);
  },
);

service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          error.message = "You Don't Deserve this Glory!! 😝";
          notify({
            title: 'Error While Making Request',
            message: error.message,
            type: 'error',
            duration: 5 * 1000,
          });
          break;
        case 500:
          router.go();
          break;
        default:
          console.log(error);
          break;
      }
    }
    return Promise.reject(error);
  },
);

export default service;

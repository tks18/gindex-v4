import axios from 'axios';
import notify from '@/components/notification';
import router from '@/router';

const service = axios.create({
  baseURL: process.env.VUE_APP_API ? process.env.VUE_APP_API : '',
});

service.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

service.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && error.response) {
      if (error.response.status === 500) {
        router.go();
      } else if (error.response.status === 401) {
        const errorResp = error;
        errorResp.message = "You Don't Deserve this Glory!! 😝";
        notify({
          title: 'Error While Making Request',
          message: error.message,
          type: 'error',
          duration: 5 * 1000,
        });
      }
    }
    return Promise.reject(errorResp);
  },
);

export default service;

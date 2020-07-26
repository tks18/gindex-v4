import axios from "axios";
import store from "@/store";
// import router from "@/router";

// Create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_API ? process.env.VUE_APP_API : "",
  //   timeout: 30000,
});

// Request interceptor
service.interceptors.request.use(
  (config) => {
    // Set cancel token when sending request
    config.cancelToken = new axios.CancelToken((cancel) => {
      store.dispatch("acrou/cancelToken/push", cancel);
    });
    return config;
  },
  (error) => {
    // Failed to send
    console.log(error);
    return Promise.reject(error);
  }
);

// Response interceptor
service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          error.message = "You Don't Deserve this Glory!! 😝";
          break;
        default:
          break;
      }
    }
    console.log(error);
    return error;
    // router.app.$router.go(-1);
    // return Promise.reject(error);
  }
);

export default service;

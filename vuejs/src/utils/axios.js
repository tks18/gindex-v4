import axios from "axios";

// Create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_API ? process.env.VUE_APP_API : "",
//   timeout: 30000,
});

export default service;

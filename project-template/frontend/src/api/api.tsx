import { default as axios } from 'axios';
// https://github.com/axios/axios syntax above explained

const instance = axios.create({
  baseURL: 'http://localhost:3000',
});

export default instance;

const axios = require('axios').default;
// https://github.com/axios/axios syntax above explained

const instance = axios.create({
  baseURL: 'http://localhost:3000',
});

export default instance;

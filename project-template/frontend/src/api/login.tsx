import axios from './api';

export const loginApi = (username: string, password: string) => {
  return axios
    .post('/login', { username, password })
    .then((res: any) => res.data);
};

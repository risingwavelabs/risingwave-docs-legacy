import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.site.singularity-data.com/api/v1',
  // baseURL: 'http://localhost:8080/api/v1',
});

export default instance;

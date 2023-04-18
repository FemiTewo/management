import axios from 'axios';

const baseURL = 'https://fantasy.premierleague.com/api';

const instance = axios.create({
  baseURL,
  timeout: 1000,
});

export default instance;

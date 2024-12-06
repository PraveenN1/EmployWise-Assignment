import axios from 'axios';
import { API_BASE_URL, LOGIN_ENDPOINT } from '../utils/constants';

export const login = async (data) => {
  return await axios.post(`${API_BASE_URL}${LOGIN_ENDPOINT}`, data);
};

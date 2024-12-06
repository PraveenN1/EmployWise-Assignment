import axios from 'axios';
import { API_BASE_URL, USERS_ENDPOINT } from '../utils/constants';

export const fetchUsers = async (page) => {
  return await axios.get(`${API_BASE_URL}${USERS_ENDPOINT}?page=${page}`);
};

export const updateUser = async (id, user) => {
  return await axios.put(`${API_BASE_URL}${USERS_ENDPOINT}/${id}`, user);
};

export const deleteUser = async (id) => {
  return await axios.delete(`${API_BASE_URL}${USERS_ENDPOINT}/${id}`);
};

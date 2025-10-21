import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE = 'http://10.0.2.2:8000/api/';

export async function login(username, password) {
  const resp = await axios.post(`${API_BASE}token/`, { username, password });
  const { access, refresh, user } = resp.data;
  await AsyncStorage.setItem('access_token', access);
  await AsyncStorage.setItem('refresh_token', refresh);
  await AsyncStorage.setItem('user', JSON.stringify(user));
  return user;
}

export async function logout() {
  await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
}

export async function getCurrentUser() {
  const user = await AsyncStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

import axios from 'axios';
import auth from './services/auth';
import order from './services/order';
import user from './services/user';
import company from './services/company';
import division from './services/division';
import pool from './services/pool';
import fleet from './services/fleet';
import fleetReport from './services/fleetReport';
import notification from './services/notification';
import search from './services/search';
import chat from './services/chat';
import testing from './services/testing';

import config from './constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = config.api;
axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';

const setToken = async () => {
  const token = await AsyncStorage.getItem("token");
  axiosInstance.defaults.headers.common['Authorization'] = 'Bearer '+token;
}

const responseBody = res => res.data;

const requests = {
  get: url => axiosInstance({ method: 'get', url }).then(responseBody),
  post: (url, data) =>
    // axiosInstance({ method: 'post', url, data }).then(responseBody),
    axiosInstance({ method: 'post', url, data }).then(responseBody).catch(err => Alert.alert('Error', err.response.data.data.message)),
  put: (url, data) =>
    axiosInstance({ method: 'put', url, data }).then(responseBody),
  delete: url => axiosInstance({ method: 'delete', url }).then(responseBody)
};

export default {
  setToken,
  auth: auth(requests),
  order: order(requests),
  user: user(requests),
  company: company(requests),
  division: division(requests),
  pool: pool(requests),
  fleet: fleet(requests),
  fleetReport: fleetReport(requests),
  notification: notification(requests),
  search: search(requests),
  chat: chat(requests),
  testing: testing(requests),
};

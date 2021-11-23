import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/";

// USER
const getUsers = () => {
  return axios.get(API_URL + "user", {headers: authHeader()});
}

const getUserById = id => {
  return axios.get(API_URL + "user/" + id, {headers: authHeader()});
}

const addUser = (newData) => {
  return axios.post(API_URL + "user", newData, {headers: authHeader()});
}

const updateUser = (id, newData) => {
  return axios.put(API_URL + "user/" + id, newData, {headers: authHeader()});
}

const deleteUser = (id) => {
  return axios.delete(API_URL + "user/" + id, {headers: authHeader()});
}

const getUserDevices = (id) => {
  return axios.get(API_URL + "devices/" + id, {headers: authHeader()});
}

// DEVICE
const getDevices = () => {
  return axios.get(API_URL + "device", {headers: authHeader()});
}

const getDeviceById = id => {
  return axios.get(API_URL + "device/" + id, {headers: authHeader()});
}

const addDevice = (newData) => {
  return axios.post(API_URL + "device", newData, {headers: authHeader()});
}

const updateDevice = (id, newData) => {
  return axios.put(API_URL + "device/" + id, newData, {headers: authHeader()});
}

const deleteDevice = (id) => {
  return axios.delete(API_URL + "device/" + id, {headers: authHeader()});
}

const getDeviceMeasurements = (id) => {
  return axios.get(API_URL + "device/measurements/" + id, {headers: authHeader()});
}

// MEASUREMENT
const getMeasurements = () => {
  return axios.get(API_URL + "measurement", {headers: authHeader()});
}

const getMeasurementById = id => {
  return axios.get(API_URL + "measurement/" + id, {headers: authHeader()});
}

const addMeasurement = (newData) => {
  return axios.post(API_URL + "measurement", newData, {headers: authHeader()});
}

const updateMeasurement = (id, newData) => {
  return axios.put(API_URL + "measurement/" + id, newData, {headers: authHeader()});
}

const deleteMeasurement = (id) => {
  return axios.delete(API_URL + "measurement/" + id, {headers: authHeader()});
}

const getMeasurementByDeviceAndDate = (device_id, date) => {
  var params = new URLSearchParams();
  params.append("device_id", device_id);
  params.append("day", date);
  let config = {
    headers: authHeader(),
    params: params,
  }
  return axios.get(API_URL + "history", config);
}

export default {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  getDevices,
  getDeviceById,
  addDevice,
  updateDevice,
  deleteDevice,
  getMeasurements,
  getMeasurementById,
  addMeasurement,
  updateMeasurement,
  deleteMeasurement,
  getDeviceMeasurements,
  getUserDevices,
  getMeasurementByDeviceAndDate,
};
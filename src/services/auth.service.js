import axios from "axios";

const API_URL = "https://ds2021-energy-daniel-backend.herokuapp.com/api/auth/";

// possible need to add the other fields
const register = (fullName, username, password, birthday, address) => {
  return axios.post(API_URL + "signup", {
    fullName,
    username, 
    password,
    birthday,
    address,
  });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "login", {
      username, 
      password,
    })
    .then((response) => {
      if(response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
}

export default {
  register,
  login,
  logout,
};
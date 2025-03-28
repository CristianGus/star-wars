import axios from "axios";

const api = axios.create({
  baseURL: "https://swapi.tech/api/",
});

export default api;

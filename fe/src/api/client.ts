import axios from "axios";

const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:4000"
    : import.meta.env.VITE_API_URL;

//create axios instance
const api = axios.create({
    baseURL : API_BASE,
    headers:{
        'Content-Type':'application/json',
    }
})

export default api;

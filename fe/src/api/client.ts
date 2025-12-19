import axios from "axios";

const API_BASE='http://localhost:4000'

//create axios instance
const api = axios.create({
    baseURL : API_BASE,
    headers:{
        'Content-Type':'application/json',
    }
})

export default api;

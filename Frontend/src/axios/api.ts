import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:7000/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  
});  

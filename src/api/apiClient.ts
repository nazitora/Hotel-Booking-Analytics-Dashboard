import axios from "axios";

export const api = axios.create({
  baseURL: "https://mt-task.onrender.com",
});
import axios from "axios";

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_AUTH_URL}/?rest_route=/simple-jwt-login/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

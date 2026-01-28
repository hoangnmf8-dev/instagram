import axios from "axios"
import {useAuth} from "../stores/authStore"
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL;
let resfreshPromise = null;

export const handleLogout = () => {
  useAuth.getState().setUser(null);
  useAuth.getState().setToken(null);
  window.location.href = "/login";
}

const getNewToken = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        refreshToken: useAuth.getState().token.refreshToken
      })
    });
    if(!response.ok) throw new Error();
    const data = await response.json();
    return data;
  } catch(error) {
    return false;
  }
}

export const httpRequest = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000
});

httpRequest.interceptors.request.use(config => {
  const access_token = useAuth.getState()?.token?.accessToken;
  if(access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
})

httpRequest.interceptors.response.use(response => response, 
  async (error) => {
    if(error.status === 401) {
      if(!resfreshPromise) {
        resfreshPromise = getNewToken();
      }
      const {data} = await resfreshPromise;
      if(data.accessToken) {
        useAuth.getState().setToken(data);
      } else {
        handleLogout();
      }
    }
    return Promise.reject(error);
  }
)
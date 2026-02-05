import axios from "axios"
import {useAuth} from "../stores/authStore"
const BASE_URL = import.meta.env.VITE_BASE_URL;
let resfreshPromise = null;

export const handleLogout = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${useAuth.getState().token?.refreshToken}`,
        "Content-Type": "application/json"
      }
    });
    if(!response.ok) throw new Error("An error has occured");
    useAuth.getState().setUser(null);
    useAuth.getState().setToken(null);
    window.location.href = "/login";
    return response.json();
  } catch(error) {
    useAuth.getState().setUser(null);
    useAuth.getState().setToken(null);
    window.location.href = "/login";
  }
}

const getNewToken = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        refreshToken: useAuth.getState().token?.refreshToken 
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
  timeout: 7000
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
    const originalRequest = error.config; 
    if(error.status === 401) {
      if (originalRequest.url.includes("/api/auth/login")) {
        return Promise.reject(error);
      }
      if(!resfreshPromise) {
        resfreshPromise = getNewToken();
      }
      const {data} = await resfreshPromise;
      resfreshPromise = null;
      if(data && data.accessToken) {
        useAuth.getState().setToken(data);
        return httpRequest(error.config);
      } else {
        handleLogout();
        return;
      }
    }
    return Promise.reject(error);
  }
)
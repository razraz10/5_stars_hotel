// lib/axiosInstance.js
import axios from "axios";
import Cookies from "js-cookie";
import { useAuthStore } from "../store/authStore";
// import { useAuthStore } from "@/stores/authStore";

const axiosSelf = axios.create({
  baseURL: "/api",
});

axiosSelf.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosSelf.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post("/api/auth/refresh", {}, { withCredentials: true });
        const newToken = res.data.token;

        Cookies.set("token", newToken);
        useAuthStore.getState().updateToken(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosSelf;

// lib/axiosInstance.js
import axios from "axios";
import Cookies from "js-cookie";
import { useAuthStore } from "../store/authStore";
// import { useAuthStore } from "@/stores/authStore";

const axiosSelf = axios.create({
  baseURL: "/api",
});

// בדיקה אם יש טוקן בקוקיז
axiosSelf.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    // אם יש טוקן, מוסיפים אותו לכותרת 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// התגובה
axiosSelf.interceptors.response.use(
  // אם התגובה בסדר, מחזירים אותה
  (response) => response,
  async (error) => {
    // אם יש שגיאה, בודקים אם היא 401 (לא מורשה) ומבצעים רענון טוקן
    const originalRequest = error.config;

    // אם השגיאה היא 401 ולא בוצע רענון טוקן קודם, מנסים לרענן את הטוקן
    if (error.response?.status === 401 && !originalRequest._retry) {
      // שליחת בקשה לרענון טוקן
      originalRequest._retry = true;
      try {
        const res = await axios.post("/api/auth/refresh", {}, { withCredentials: true });
        const newToken = res.data.token;

        Cookies.set("token", newToken);
        useAuthStore.getState().updateToken(newToken);

        // עדכון הכותרת עם הטוקן החדש
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // אם רענון הטוקן נכשל, מבצעים התנתקות
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosSelf;

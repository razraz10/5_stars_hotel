import { create } from "zustand";
import Cookies from "js-cookie";  
import axios from "axios";

export const useAuthStore = create((set) => ({
  // בודק אם יש קוקיז עם פרטי משתמש וטוקן 
  user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
  token: Cookies.get("token") || null,

  // בלחיצה על כפתור התחברות, שומר את פרטי המשתמש והטוקן בקוקיז
  // ומעדכן את הסטייט של המשתמש והטוקן
  login: (user, token) => {
    Cookies.set("user", JSON.stringify(user)); 
    Cookies.set("token", token); 
    set({ user, token });
  },

  // בלחיצה על כפתור התנתקות, מוחק את הקוקיז של המשתמש והטוקן
  // null-ומעדכן את הסטייט של המשתמש והטוקן ל        
  logout: async () => {
    await axios.post("/api/auth/logout");
    Cookies.remove("user");
    Cookies.remove("token");
    set({ user: null, token: null });
  },

  // רענון טוקן - שולח בקשה לשרת לרענון הטוקן
  // אם הבקשה מצליחה, מעדכן את הקוקיז ואת הסטייט של המשתמש והטוקן
  refreshToken: async () => {
    try {
      const { data } = await axios.post("/api/auth/refresh");
      Cookies.set("token", data.token);
      set({ token: data.token, user: data.user });
      return data.token;
    } catch (err) {
      console.error("רענון נכשל", err);
      set({ user: null, token: null });
      return null;
    }
  },

  // עידכון טוקן - מעדכן את הקוקיז ואת הסטייט של הטוקן
  // אם יש טוקן חדש, מעדכן את הקוקיז ואת הסטייט של הטוקן
  updateToken: (newToken) => {
    Cookies.set("token", newToken);
    set({ token: newToken });
  },

  // מעדכן את פרטי המשתמש בקוקיז ובסטייט
  updateUser: (updateUser) => set((state) => {
    const updatedUser = { ...state.user, ...updateUser };
    Cookies.set("user", JSON.stringify(updatedUser)); // Update user cookie
    return { user: updatedUser };
  })
}));
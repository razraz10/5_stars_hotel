import { create } from "zustand";
import Cookies from "js-cookie";  
import axios from "axios";

export const useAuthStore = create((set) => ({
  // בודק אם יש קוקיז עם פרטי משתמש וטוקן 
  user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
  token: Cookies.get("token") || null,
  tokenExpiryTime: Cookies.get("tokenExpiryTime") || null,

  // בלחיצה על כפתור התחברות, שומר את פרטי המשתמש והטוקן בקוקיז
  // ומעדכן את הסטייט של המשתמש והטוקן
  login: (user, token) => {
    try {
    // חישוב זמן התפוגה (שעה מעכשיו)
    const expiryTime = new Date().getTime() + 55 * 60 * 1000; // 55 דקות

    Cookies.set("user", JSON.stringify(user)); 
    Cookies.set("token", token); 
    Cookies.set("tokenExpiryTime", expiryTime.toString());
    set({ user, token, tokenExpiryTime: expiryTime });

   // התחלת טיימר רענון
   useAuthStore.getState().startRefreshTimer();
  } catch (error) {
    console.error("שגיאה בשמירת נתוני התחברות:", error);
    throw error;
  }
  },

  // בלחיצה על כפתור התנתקות, מוחק את הקוקיז של המשתמש והטוקן
  // null-ומעדכן את הסטייט של המשתמש והטוקן ל        
  logout: async () => {
    await axios.post("/api/auth/logout");
    Cookies.remove("user");
    Cookies.remove("token");
    Cookies.remove("tokenExpiryTime");
    set({ user: null, token: null, tokenExpiryTime: null });
  },

  // רענון טוקן - שולח בקשה לשרת לרענון הטוקן
  // אם הבקשה מצליחה, מעדכן את הקוקיז ואת הסטייט של המשתמש והטוקן
  refreshToken: async () => {
    try {
      const { data } = await axios.get("/api/auth/refresh", {
        withCredentials: true // חשוב להוסיף את זה
      });

      const expiryTime = new Date().getTime() + 55 * 60 * 1000;

      Cookies.set("token", data.token);
      Cookies.set("tokenExpiryTime", expiryTime.toString());
      Cookies.set("user", JSON.stringify(data.user));

      set({ token: data.token, user: data.user, tokenExpiryTime: expiryTime });
      return data.token;
    } catch (err) {
      console.error("רענון נכשל", err);
      // במקרה של שגיאה, מנקה את ה-state והקוקיז
    Cookies.remove("user");
    Cookies.remove("token");
    Cookies.remove("tokenExpiryTime");
      set({ user: null, token: null, tokenExpiryTime: null });
      return null;
    }
  },

  startRefreshTimer: () => {
    const checkAndRefresh = async () => {
      const expiryTime = Cookies.get("tokenExpiryTime");
      const currentToken = Cookies.get("token");

      if (!expiryTime || !currentToken) {
        console.log("לא נמצא טוקן או זמן תפוגה");
        return;
      }

      const timeUntilExpiry = parseInt(expiryTime) - new Date().getTime();
      
      // אם נשארו פחות מ-5 דקות, מרענן את הטוקן
      if (timeUntilExpiry < 5 * 60 * 1000) {
        await useAuthStore.getState().refreshToken();
      }
    };

    // בדיקה כל דקה
    const intervalId = setInterval(checkAndRefresh, 60 * 1000);
    checkAndRefresh(); // בדיקה מיידית
    // מחזיר את ה-ID של ה-interval כדי שנוכל לנקות אותו מאוחר יותר אם נצטרך 
    return intervalId;
  },
  
  // עידכון טוקן - מעדכן את הקוקיז ואת הסטייט של הטוקן
  // אם יש טוקן חדש, מעדכן את הקוקיז ואת הסטייט של הטוקן
  // updateToken: (newToken) => {
  //   Cookies.set("token", newToken);
  //   set({ token: newToken });
  // },

  // מעדכן את פרטי המשתמש בקוקיז ובסטייט
  updateUser: (updateUser) => set((state) => {
    const updatedUser = { ...state.user, ...updateUser };
    Cookies.set("user", JSON.stringify(updatedUser)); // Update user cookie
    return { user: updatedUser };
  })
}));

// הפעלת הטיימר כשהאפליקציה נטענת
if (typeof window !== 'undefined') {
  const intervalId = useAuthStore.getState().startRefreshTimer();
  
  // ניקוי הטיימר כשהקומפוננטה מתפרקת
  window.addEventListener('beforeunload', () => {
    clearInterval(intervalId);
  });
}
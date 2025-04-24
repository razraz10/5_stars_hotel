import { create } from "zustand";
import Cookies from "js-cookie";  // Import js-cookie
import axios from "axios";

export const useAuthStore = create((set) => ({
  // Initialize user and token from cookies if available
  user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
  token: Cookies.get("token") || null,

  // Login function to store user and token in cookies
  login: (user, token) => {
    Cookies.set("user", JSON.stringify(user)); // Save user to cookie
    Cookies.set("token", token); // Save token to cookie
    set({ user, token });
  },

  // Logout function to remove user and token from cookies
  logout: async () => {
    await axios.post("/api/auth/logout");
    Cookies.remove("user");
    Cookies.remove("token");
    set({ user: null, token: null });
  },

  refreshToken: async () => {
    try {
      const { data } = await axios.get("/api/auth/refresh");
      Cookies.set("token", data.token);
      set({ token: data.token, user: data.user });
      return data.token;
    } catch (err) {
      console.error("רענון נכשל", err);
      set({ user: null, token: null });
      return null;
    }
  },

  updateToken: (newToken) => {
    Cookies.set("token", newToken);
    set({ token: newToken });
  },

  // Update user function to save updated user to both state and cookie
  updateUser: (updateUser) => set((state) => {
    const updatedUser = { ...state.user, ...updateUser };
    Cookies.set("user", JSON.stringify(updatedUser)); // Update user cookie
    return { user: updatedUser };
  })
}));


// import { create } from "zustand";

// export const useAuthStore = create((set) => ({
//   user: null,
//   token: null,
//   login: (user, token) => set({ user, token  }),
//   logout: () => set({ user: null, token: null }),
//   updateUser: (updateUser) => set((state)=>({
//     user: {...state.user, ...updateUser}
//   }))
// }));

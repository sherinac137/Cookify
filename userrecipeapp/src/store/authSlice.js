import { createSlice } from "@reduxjs/toolkit";

//To retreive token and user from local storage
const token = localStorage.getItem("token");
const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: token || null,
    user: user || null,
    isAuthenticated: !!token,
  },
  reducers: {
    setUser: (state, action) => {
      const { token, user } = action.payload;
      console.log("Setting user:", user);
      state.token = token;
      state.user = user;
      state.isAuthenticated = true; //Mark user authenticated

      //to presist on local storage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    removeUser: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      //to clear on local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, removeUser } = authSlice.actions;
export default authSlice.reducer;


import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice.js";
import profileSlice from "./slices/profileSlice.js";

const store = configureStore({
  reducer: {
    auth: authSlice,
    profile: profileSlice,
  },
});

export default store;

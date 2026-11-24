import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice.js";
import profileSlice from "./slices/profileSlice.js";
import postsSlice from "./slices/postsSlice.js";
import followSlice from "./slices/followSlice.js";
import searchSlice from "./slices/searchSlice.js";

const store = configureStore({
  reducer: {
    auth: authSlice,
    profile: profileSlice,
    posts: postsSlice,
    follow: followSlice,
    search: searchSlice,
  },
});

export default store;

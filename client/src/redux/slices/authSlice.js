
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);

      const { token, userId } = response.data;

      if (!token || !userId) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Login failed",
      );
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Request failed",
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/reset-password`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Password reset failed",
      );
    }
  },
);


export const checkUsername = createAsyncThunk(
  "auth/checkUsername",
  async (username, { rejectWithValue }) => {
    try {
      await axios.get(
        `${API_URL}/profile/${encodeURIComponent(username)}`,
      );

      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        return false;
      }

      return rejectWithValue(
        error.response?.data?.message ||
          "Could not check username",
      );
    }
  },
);


const authSlice = createSlice({
  name: "auth",

  initialState: {
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("userId"),
    loading: false,
    error: null,
    message: null,
  },

  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      state.token = null;
      state.userId = null;
      state.error = null;
      state.message = null;
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    clearAuthMessage: (state) => {
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.message = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError, clearAuthMessage } =
  authSlice.actions;

export default authSlice.reducer;

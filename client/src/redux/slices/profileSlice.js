import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "./authSlice.js";

const API_URL = import.meta.env.VITE_API_URL;

export const getMyProfile = createAsyncThunk(
  "profile/getMyProfile",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const response = await axios.get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }

      return rejectWithValue(
        error.response?.data?.message || "Failed to load profile",
      );
    }
  },
);

export const getOtherProfile = createAsyncThunk(
  "profile/getOtherProfile",
  async (username, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/profile/${encodeURIComponent(username)}`,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load user profile",
      );
    }
  },
);

export const updateMyProfile = createAsyncThunk(
  "profile/updateMyProfile",
  async (profileData, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const { username, bio, website, avatar } = profileData;
      let requestData;
      if (avatar) {
        requestData = new FormData();
        if (username !== undefined) {
          requestData.append("username", username);
        }
        if (bio !== undefined) {
          requestData.append("bio", bio);
        }
        if (website !== undefined) {
          requestData.append("website", website);
        }
        requestData.append("avatar", avatar);
      } else {
        requestData = {};
        if (username !== undefined) {
          requestData.username = username;
        }
        if (bio !== undefined) {
          requestData.bio = bio;
        }
        if (website !== undefined) {
          requestData.website = website;
        }
      }
      const response = await axios.patch(`${API_URL}/profile`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile",
      );
    }
  },
);

const initialState = {
  myProfile: null,
  otherProfile: null,
  loading: false,
  saving: false,
  error: null,
  saveError: null,
  message: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,

  reducers: {
    clearProfileError: (state) => {
      state.error = null;
      state.saveError = null;
    },

    clearProfileMessage: (state) => {
      state.message = null;
    },

    clearOtherProfile: (state) => {
      state.otherProfile = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.myProfile = action.payload;
      })
      .addCase(getMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOtherProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otherProfile = null;
      })
      .addCase(getOtherProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.otherProfile = action.payload;
      })
      .addCase(getOtherProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateMyProfile.pending, (state) => {
        state.saving = true;
        state.saveError = null;
        state.message = null;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.message = action.payload.message;
        if (state.myProfile) {
          state.myProfile.user = {
            ...state.myProfile.user,
            ...action.payload.user,
          };
        }
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload;
      })
      .addCase(logout, () => initialState);
  },
});

export const { clearProfileError, clearProfileMessage, clearOtherProfile } =
  profileSlice.actions;

export default profileSlice.reducer;

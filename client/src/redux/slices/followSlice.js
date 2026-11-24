import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "./authSlice.js";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = (getState) => ({
  Authorization: `Bearer ${getState().auth.token}`,
});

export const getFollowing = createAsyncThunk(
  "follow/getFollowing",
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = getState().auth.userId;

      if (!userId) {
        return rejectWithValue("User ID is missing");
      }

      const response = await axios.get(`${API_URL}/following/${userId}`);

      return response.data.map((user) => user._id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load following",
      );
    }
  },
);

export const followUser = createAsyncThunk(
  "follow/followUser",
  async ({ username, userId }, { getState, dispatch, rejectWithValue }) => {
    try {
      await axios.post(
        `${API_URL}/users/${encodeURIComponent(username)}/follow`,
        {},
        {
          headers: getAuthHeaders(getState),
        },
      );

      return userId;
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }

      return rejectWithValue(
        error.response?.data?.message || "Failed to follow user",
      );
    }
  },
);

export const unfollowUser = createAsyncThunk(
  "follow/unfollowUser",
  async ({ username, userId }, { getState, dispatch, rejectWithValue }) => {
    try {
      await axios.delete(
        `${API_URL}/users/${encodeURIComponent(username)}/follow`,
        {
          headers: getAuthHeaders(getState),
        },
      );

      return userId;
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }

      return rejectWithValue(
        error.response?.data?.message || "Failed to unfollow user",
      );
    }
  },
);

const initialState = {
  followingIds: [],
  loading: false,
  loaded: false,
  pendingIds: [],
  error: null,
};

const followSlice = createSlice({
  name: "follow",
  initialState,

  reducers: {
    clearFollowError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getFollowing.pending, (state) => {
        state.loading = true;
        state.loaded = false;
        state.error = null;
      })
      .addCase(getFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.followingIds = action.payload;
      })
      .addCase(getFollowing.rejected, (state, action) => {
        state.loading = false;
        state.loaded = false;
        state.error = action.payload;
      })

      .addCase(followUser.pending, (state, action) => {
        const userId = action.meta.arg.userId;

        if (!state.pendingIds.includes(userId)) {
          state.pendingIds.push(userId);
        }

        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        const userId = action.payload;

        state.pendingIds = state.pendingIds.filter((id) => id !== userId);

        if (!state.followingIds.includes(userId)) {
          state.followingIds.push(userId);
        }
      })
      .addCase(followUser.rejected, (state, action) => {
        state.pendingIds = state.pendingIds.filter(
          (id) => id !== action.meta.arg.userId,
        );

        state.error = action.payload;
      })

      .addCase(unfollowUser.pending, (state, action) => {
        const userId = action.meta.arg.userId;

        if (!state.pendingIds.includes(userId)) {
          state.pendingIds.push(userId);
        }

        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        const userId = action.payload;

        state.pendingIds = state.pendingIds.filter((id) => id !== userId);

        state.followingIds = state.followingIds.filter((id) => id !== userId);
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.pendingIds = state.pendingIds.filter(
          (id) => id !== action.meta.arg.userId,
        );

        state.error = action.payload;
      })

      .addCase(logout, () => initialState);
  },
});

export const { clearFollowError } = followSlice.actions;

export default followSlice.reducer;

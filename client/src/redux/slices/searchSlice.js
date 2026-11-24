import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const searchUsers = createAsyncThunk(
  "search/searchUsers",
  async (query, { signal, rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/users/search`, {
        params: {
          q: query.trim(),
        },
        signal,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search users",
      );
    }
  },
);

const initialState = {
  users: [],
  query: "",
  loading: false,
  error: null,
  currentRequestId: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,

  reducers: {
    clearSearch: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.users = [];
        state.query = action.meta.arg;
        state.currentRequestId = action.meta.requestId;
      })

      .addCase(searchUsers.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) {
          return;
        }

        state.loading = false;
        state.users = action.payload;
        state.currentRequestId = null;
      })

      .addCase(searchUsers.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) {
          return;
        }

        state.loading = false;
        state.currentRequestId = null;

        if (action.meta.aborted) {
          return;
        }

        state.error = action.payload || "Failed to search users";
      });
  },
});

export const { clearSearch } = searchSlice.actions;

export default searchSlice.reducer;

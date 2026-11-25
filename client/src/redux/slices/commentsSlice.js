import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "./authSlice.js";
import { deletePost } from "./postsSlice.js";

const API_URL = import.meta.env.VITE_API_URL;

const authHeaders = (getState) => ({
  Authorization: `Bearer ${getState().auth.token}`,
});

const getError = (error, fallback) => error.response?.data?.message || fallback;

export const getComments = createAsyncThunk(
  "comments/getComments",
  async (postId, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const response = await axios.get(`${API_URL}/posts/${postId}/comments`, {
        headers: token ? authHeaders(getState) : {},
      });

      return { postId, comments: response.data };
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      return rejectWithValue(getError(error, "Failed to load comments"));
    }
  },
);

export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({ postId, text }, { getState, dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/posts/${postId}/comments`,
        { text },
        { headers: authHeaders(getState) },
      );

      return { postId, comment: response.data.comment };
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      return rejectWithValue(getError(error, "Failed to create comment"));
    }
  },
);

export const likeComment = createAsyncThunk(
  "comments/likeComment",
  async ({ postId, commentId }, { getState, dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/comments/${commentId}/like`,
        {},
        { headers: authHeaders(getState) },
      );

      return {
        postId,
        commentId,
        likesCount: response.data.likesCount,
        isLiked: response.data.isLiked,
      };
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      return rejectWithValue(getError(error, "Failed to like comment"));
    }
  },
);

export const unlikeComment = createAsyncThunk(
  "comments/unlikeComment",
  async ({ postId, commentId }, { getState, dispatch, rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/comments/${commentId}/like`,
        { headers: authHeaders(getState) },
      );

      return {
        postId,
        commentId,
        likesCount: response.data.likesCount,
        isLiked: response.data.isLiked,
      };
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      return rejectWithValue(getError(error, "Failed to unlike comment"));
    }
  },
);

const initialState = {
  commentsByPost: {},
  loadingByPost: {},
  sendingByPost: {},
  pendingLikeIds: [],
  errorsByPost: {},
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    const updateCommentLike = (state, action) => {
      const { postId, commentId, likesCount, isLiked } = action.payload;

      const target = state.commentsByPost[postId]?.find(
        (comment) => comment._id === commentId,
      );

      if (target) {
        target.likesCount = likesCount;
        target.isLiked = isLiked;
      }

      state.pendingLikeIds = state.pendingLikeIds.filter(
        (id) => id !== commentId,
      );
    };

    const setLikePending = (state, action) => {
      const { postId, commentId } = action.meta.arg;

      if (!state.pendingLikeIds.includes(commentId)) {
        state.pendingLikeIds.push(commentId);
      }

      state.errorsByPost[postId] = null;
    };

    const setLikeError = (state, action) => {
      const { postId, commentId } = action.meta.arg;

      state.pendingLikeIds = state.pendingLikeIds.filter(
        (id) => id !== commentId,
      );

      state.errorsByPost[postId] =
        action.payload || "Failed to update comment like";
    };

    builder
      .addCase(getComments.pending, (state, action) => {
        const postId = action.meta.arg;
        state.loadingByPost[postId] = true;
        state.errorsByPost[postId] = null;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;

        state.loadingByPost[postId] = false;
        state.commentsByPost[postId] = comments;
      })
      .addCase(getComments.rejected, (state, action) => {
        const postId = action.meta.arg;

        state.loadingByPost[postId] = false;
        state.errorsByPost[postId] =
          action.payload || "Failed to load comments";
      })

      .addCase(createComment.pending, (state, action) => {
        const { postId } = action.meta.arg;

        state.sendingByPost[postId] = true;
        state.errorsByPost[postId] = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;

        state.sendingByPost[postId] = false;

        if (!state.commentsByPost[postId]) {
          state.commentsByPost[postId] = [];
        }

        state.commentsByPost[postId].unshift(comment);
      })
      .addCase(createComment.rejected, (state, action) => {
        const { postId } = action.meta.arg;

        state.sendingByPost[postId] = false;
        state.errorsByPost[postId] = action.payload || "Failed to send comment";
      })

      .addCase(likeComment.pending, setLikePending)
      .addCase(likeComment.fulfilled, updateCommentLike)
      .addCase(likeComment.rejected, setLikeError)

      .addCase(unlikeComment.pending, setLikePending)
      .addCase(unlikeComment.fulfilled, updateCommentLike)
      .addCase(unlikeComment.rejected, setLikeError)

      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.payload.postId;

        delete state.commentsByPost[postId];
        delete state.loadingByPost[postId];
        delete state.sendingByPost[postId];
        delete state.errorsByPost[postId];
      })

      .addCase(logout, () => initialState);
  },
});

export default commentsSlice.reducer;

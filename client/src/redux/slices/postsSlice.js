import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "./authSlice.js";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = (getState) => ({
  Authorization: `Bearer ${getState().auth.token}`,
});

export const getPosts = createAsyncThunk(
  "posts/getPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load posts",
      );
    }
  },
);

export const getFeedPosts = createAsyncThunk(
  "posts/getFeedPosts",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/posts/feed`, {
        headers: getAuthHeaders(getState),
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }

      return rejectWithValue(
        error.response?.data?.message || "Failed to load feed",
      );
    }
  },
);

export const getPost = createAsyncThunk(
  "posts/getPost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/posts/${postId}`);

      return response.data.post;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load post",
      );
    }
  },
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { getState, dispatch, rejectWithValue }) => {
    try {
      const { description, image, video } = postData;

      const formData = new FormData();

      formData.append("description", description);

      if (image) {
        formData.append("image", image);
      }

      if (video) {
        formData.append("video", video);
      }

      const response = await axios.post(
        `${API_URL}/profile/newpost`,
        formData,
        {
          headers: getAuthHeaders(getState),
        },
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }

      return rejectWithValue(
        error.response?.data?.message || "Failed to create post",
      );
    }
  },
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { getState, dispatch, rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/posts/${postId}`, {
        headers: getAuthHeaders(getState),
      });

      return {
        postId,
        message: response.data.message,
      };
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }

      return rejectWithValue(
        error.response?.data?.message || "Failed to delete post",
      );
    }
  },
);

export const getPostLikes = createAsyncThunk(
  "posts/getPostLikes",
  async (postId, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/posts/${postId}/likes`);

      const userId = getState().auth.userId;

      return {
        postId,
        users: response.data,
        isLiked: response.data.some((user) => user._id === userId),
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load likes",
      );
    }
  },
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId, { getState, dispatch, rejectWithValue }) => {
    try {
      await axios.post(
        `${API_URL}/posts/${postId}/like`,
        {},
        {
          headers: getAuthHeaders(getState),
        },
      );

      return postId;
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }

      return rejectWithValue(
        error.response?.data?.message || "Failed to like post",
      );
    }
  },
);

export const unlikePost = createAsyncThunk(
  "posts/unlikePost",
  async (postId, { getState, dispatch, rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/posts/${postId}/like`, {
        headers: getAuthHeaders(getState),
      });

      return postId;
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }

      return rejectWithValue(
        error.response?.data?.message || "Failed to unlike post",
      );
    }
  },
);

const updateLikesCount = (state, postId, change) => {
  const update = (post) => {
    if (post._id !== postId) return;

    if (typeof post.likesCount === "number") {
      post.likesCount = Math.max(0, post.likesCount + change);
    }
  };

  state.posts.forEach(update);
  state.feedPosts.forEach(update);

  if (state.currentPost) {
    update(state.currentPost);
  }
};

const initialState = {
  posts: [],
  feedPosts: [],
  currentPost: null,
  likesByPost: {},

  loading: false,
  creating: false,
  deleting: false,
  liking: false,

  error: null,
  message: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,

  reducers: {
    clearPostsError: (state) => {
      state.error = null;
    },

    clearPostsMessage: (state) => {
      state.message = null;
    },

    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getFeedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.feedPosts = action.payload;
      })
      .addCase(getFeedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getPost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentPost = null;
      })
      .addCase(getPost.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(getPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createPost.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.message = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.creating = false;
        state.message = action.payload.message;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })

      .addCase(deletePost.pending, (state) => {
        state.deleting = true;
        state.error = null;
        state.message = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.deleting = false;
        state.message = action.payload.message;

        const postId = action.payload.postId;

        state.posts = state.posts.filter((post) => post._id !== postId);

        state.feedPosts = state.feedPosts.filter((post) => post._id !== postId);

        if (state.currentPost?._id === postId) {
          state.currentPost = null;
        }

        delete state.likesByPost[postId];
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })

      .addCase(getPostLikes.pending, (state) => {
        state.error = null;
      })
      .addCase(getPostLikes.fulfilled, (state, action) => {
        const { postId, users, isLiked } = action.payload;

        state.likesByPost[postId] = {
          users,
          isLiked,
        };
      })
      .addCase(getPostLikes.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(likePost.pending, (state) => {
        state.liking = true;
        state.error = null;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.liking = false;

        const postId = action.payload;

        updateLikesCount(state, postId, 1);

        state.likesByPost[postId] = {
          users: null,
          isLiked: true,
        };
      })
      .addCase(likePost.rejected, (state, action) => {
        state.liking = false;
        state.error = action.payload;
      })

      .addCase(unlikePost.pending, (state) => {
        state.liking = true;
        state.error = null;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.liking = false;

        const postId = action.payload;

        updateLikesCount(state, postId, -1);

        state.likesByPost[postId] = {
          users: null,
          isLiked: false,
        };
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.liking = false;
        state.error = action.payload;
      })

      .addCase(logout, () => initialState);
  },
});

export const { clearPostsError, clearPostsMessage, clearCurrentPost } =
  postsSlice.actions;

export default postsSlice.reducer;

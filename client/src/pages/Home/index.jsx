import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Post from "../../components/Post";
import EndPosts from "../../components/EndPosts";

import { getPosts } from "../../redux/slices/postsSlice.js";
import { getFollowing } from "../../redux/slices/followSlice.js";

import { styles } from "./styles";

function Home() {
  const dispatch = useDispatch();

  const { posts, loading, error } = useSelector((state) => state.posts);

  const {
    followingIds,
    loading: followingLoading,
    loaded: followingLoaded,
    error: followingError,
  } = useSelector((state) => state.follow);

  useEffect(() => {
    dispatch(getPosts());
    dispatch(getFollowing());
  }, [dispatch]);

  const orderedPosts = useMemo(() => {
    const followingSet = new Set(followingIds);

    const followedPosts = [];
    const otherPosts = [];

    posts.forEach((post) => {
      const authorId = post.author?._id;

      if (followingSet.has(authorId)) {
        followedPosts.push(post);
      } else {
        otherPosts.push(post);
      }
    });

    return [...followedPosts, ...otherPosts];
  }, [posts, followingIds]);

  const isLoading =
    (loading && posts.length === 0) || (followingLoading && !followingLoaded);

  const loadError =
    (!followingLoaded && followingError) || (posts.length === 0 && error);

  return (
    <Box sx={styles.container}>
      {isLoading ? (
        <Typography sx={styles.statusText}>Loading posts...</Typography>
      ) : loadError ? (
        <Typography sx={styles.statusText}>{loadError}</Typography>
      ) : orderedPosts.length === 0 ? (
        <Typography sx={styles.statusText}>No posts yet.</Typography>
      ) : (
        <>
          <Box sx={styles.postsGrid}>
            {orderedPosts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </Box>

          <EndPosts />
        </>
      )}
    </Box>
  );
}

export default Home;

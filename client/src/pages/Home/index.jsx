
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import Post from "../../components/Post";
import EndPosts from "../../components/EndPosts";

import MyPostModal from "../../components/MyPostModal";
import OtherPostModal from "../../components/OtherPostModal";

import { getPosts } from "../../redux/slices/postsSlice.js";
import { getFollowing } from "../../redux/slices/followSlice.js";

import { styles } from "./styles";

function Home() {
  const dispatch = useDispatch();

  const { posts, loading, error } = useSelector(
    (state) => state.posts,
  );

  const currentUserId = useSelector(
    (state) => state.auth.userId,
  );

  const {
    followingIds,
    loading: followingLoading,
    loaded: followingLoaded,
    error: followingError,
  } = useSelector((state) => state.follow);

  const [selectedPostId, setSelectedPostId] = useState(null);

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

  const selectedPost =
    posts.find((post) => post._id === selectedPostId) ?? null;

  const isOwnPost =
    selectedPost?.author?._id === currentUserId;

  const closePost = () => {
    setSelectedPostId(null);
  };

  const isLoading =
    (loading && posts.length === 0) ||
    (followingLoading && !followingLoaded);

  const loadError =
    (!followingLoaded && followingError) ||
    (posts.length === 0 && error);

  return (
    <>
      <Box sx={styles.container}>
        {isLoading ? (
          <Typography sx={styles.statusText}>
            Loading posts...
          </Typography>
        ) : loadError ? (
          <Typography sx={styles.statusText}>
            {loadError}
          </Typography>
        ) : orderedPosts.length === 0 ? (
          <Typography sx={styles.statusText}>
            No posts yet.
          </Typography>
        ) : (
          <>
            <Box sx={styles.postsGrid}>
              {orderedPosts.map((post) => (
                <Post
                  key={post._id}
                  post={post}
                  onOpenComments={setSelectedPostId}
                />
              ))}
            </Box>

            <EndPosts />
          </>
        )}
      </Box>

      <Modal
        open={Boolean(selectedPost)}
        onClose={closePost}
      >
        <Box
          sx={{
            width: "100%",
            margin: "0 auto",
            outline: "none",
          }}
        >
          {selectedPost &&
            (isOwnPost ? (
              <MyPostModal
                post={selectedPost}
                user={selectedPost.author}
                onClose={closePost}
              />
            ) : (
              <OtherPostModal
                post={selectedPost}
                user={selectedPost.author}
              />
            ))}
        </Box>
      </Modal>
    </>
  );
}

export default Home;

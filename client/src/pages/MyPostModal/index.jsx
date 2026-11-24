import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";

import itchgram from "../../assets/itchgram.png";
import like from "../../assets/DrawerSvg/Light/Notification.svg";
import comment from "../../assets/Comment.svg";

import EditPost from "../EditPost";
import { styles } from "./styles";

const formatPostDate = (date) => {
  if (!date) return "";

  const postDate = new Date(date);

  if (Number.isNaN(postDate.getTime())) return "";

  return postDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function MyPostModal({ post }) {
  const [commentar, setComment] = useState("");
  const [openEditPost, setOpenEditPost] = useState(false);

  const user = useSelector((state) => state.profile.myProfile?.user);

  if (!post) return null;

  const username = user?.username ?? "";
  const avatarUrl = user?.avatarUrl || itchgram;
  const postDate = formatPostDate(post.createdAt);

  const likesText =
    typeof post.likesCount === "number" ? `${post.likesCount} likes` : "Likes";

  return (
    <Box sx={styles.container}>
      {post.image ? (
        <Box
          component="img"
          src={post.image}
          alt={post.description || "Post"}
          sx={styles.postImage}
          data-post-modal-content
        />
      ) : post.video ? (
        <Box
          component="video"
          src={post.video}
          controls
          playsInline
          preload="metadata"
          sx={styles.postImage}
          data-post-modal-content
        />
      ) : null}

      <Box sx={styles.rightColumn} data-post-modal-content>
        <Box sx={styles.topSection}>
          <Box sx={styles.header}>
            <Box sx={styles.headerUser}>
              <IconButton aria-label="User profile" sx={styles.iconButton}>
                <Box
                  component="img"
                  src={avatarUrl}
                  alt={username}
                  sx={styles.avatar}
                />
              </IconButton>

              <NavLink to="/profile" style={styles.usernameLink}>
                {username}
              </NavLink>
            </Box>

            <Button
              onClick={() => setOpenEditPost(true)}
              sx={styles.menuButton}
            >
              •••
            </Button>
          </Box>

          <Box sx={styles.scrollArea}>
            <Box sx={styles.descriptionRow}>
              <IconButton aria-label="User profile" sx={styles.iconButton}>
                <Box
                  component="img"
                  src={avatarUrl}
                  alt={username}
                  sx={styles.avatar}
                />
              </IconButton>

              <Box sx={styles.descriptionBody}>
                <Typography sx={styles.descriptionText}>
                  <NavLink to="/profile" style={styles.usernameLink}>
                    {username}
                  </NavLink>
                  {"  "}
                  {post.description}
                </Typography>

                <Typography sx={styles.metaText}>{postDate}</Typography>
              </Box>
            </Box>

            <Box sx={styles.commentsList}>
              {Array.from({ length: 4 }, (_, index) => (
                <Box key={index} sx={styles.commentRow}>
                  <Box sx={styles.commentAuthorRow}>
                    <IconButton
                      aria-label="Comment on post"
                      sx={styles.iconButton}
                    >
                      <Box
                        component="img"
                        src={itchgram}
                        alt="itchgram"
                        sx={styles.avatar}
                      />
                    </IconButton>

                    <Box sx={styles.commentDetails}>
                      <Box sx={styles.commentContentRow}>
                        <NavLink to="/profile" style={styles.usernameLink}>
                          username
                        </NavLink>

                        <Typography sx={styles.commentText}>
                          спасибо!!!!
                        </Typography>
                      </Box>

                      <Box sx={styles.commentMetaRow}>
                        <Typography sx={styles.metaText}>17 h.</Typography>

                        <Typography sx={styles.metaText}>Likes: 1</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <IconButton aria-label="Like comment" sx={styles.iconButton}>
                    <Box
                      component="img"
                      src={like}
                      alt="like"
                      sx={styles.commentLikeIcon}
                    />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box sx={styles.bottomSection}>
          <Box>
            <Box sx={styles.actions}>
              <Box
                component="img"
                src={like}
                alt="like"
                sx={styles.actionIcon}
              />

              <Box
                component="img"
                src={comment}
                alt="comment"
                sx={styles.actionIcon}
              />
            </Box>

            <Box sx={styles.likesInfo}>
              <Typography sx={styles.likesCount}>{likesText}</Typography>

              <Typography sx={styles.postDate}>{postDate}</Typography>
            </Box>
          </Box>

          <Box sx={styles.commentForm}>
            <IconButton aria-label="Choose emoji" sx={styles.emojiButton}>
              <SentimentSatisfiedAltOutlinedIcon sx={styles.emojiIcon} />
            </IconButton>

            <TextField
              placeholder="Add comment"
              value={commentar}
              onChange={(e) => setComment(e.target.value)}
              sx={styles.commentInput}
            />

            <Button sx={styles.sendButton}>Send</Button>
          </Box>
        </Box>
      </Box>

      {openEditPost && (
        <Box
          sx={styles.editMenuOverlay}
          data-post-modal-content
          onClick={() => setOpenEditPost(false)}
        >
          <Box onClick={(event) => event.stopPropagation()}>
            <EditPost
              onCancel={() => setOpenEditPost(false)}
              onGoToPost={() => setOpenEditPost(false)}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default MyPostModal;

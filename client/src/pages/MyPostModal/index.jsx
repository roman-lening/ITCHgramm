
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import testImage from "../../assets/TestImagePost.svg";
import itchgram from "../../assets/itchgram.png";
import Typography from "@mui/material/Typography";
import like from "../../assets/DrawerSvg/Light/Notification.svg";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import comment from "../../assets/Comment.svg";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import { styles } from "./styles";
import { useState } from "react";

function MyPostModal() {
  const [commentar, setComment] = useState("");

  return (
    <Box sx={styles.container}>
      <Box
        component="img"
        src={testImage}
        alt="testImage"
        sx={styles.postImage}
          data-post-modal-content
      />
      <Box sx={styles.rightColumn}   data-post-modal-content>
        <Box sx={styles.topSection}>
          <Box sx={styles.header}>
            <IconButton aria-label="Comment on post" sx={styles.iconButton}>
              <Box
                component="img"
                src={itchgram}
                alt="itchgram"
                sx={styles.avatar}
              />
            </IconButton>
            <Box sx={styles.headerInfo}>
              <NavLink style={styles.usernameLink}>username</NavLink>
              <Divider sx={styles.dot} />
              <Button sx={styles.followButton}>Подписаться</Button>
            </Box>
          </Box>
          <Box sx={styles.scrollArea}>
            <Box sx={styles.descriptionRow}>
              <IconButton aria-label="Comment on post" sx={styles.iconButton}>
                <Box
                  component="img"
                  src={itchgram}
                  alt="itchgram"
                  sx={styles.avatar}
                />
              </IconButton>
              <Box sx={styles.descriptionBody}>
                <Typography sx={styles.descriptionText}>
                  <NavLink component="span" style={styles.usernameLink}>
                    username
                  </NavLink>
                  {"  "}
                  Черногории! Проект по поддержке бездомных животных TailBook, в
                  разработке которого участвуют сразу 9 наших стажёров, будет
                  представлен на Web Summit 2024 в Португалии🔥Черногории!
                  Проект по поддержке бездомных животных TailBook, в разработке
                  которого участвуют сразу 9 наших стажёров, будет представлен
                  на Web Summit 2024 в Португалии🔥Черногории! Проект по
                  поддержке бездомных животных TailBook, в разработке которого
                  участвуют сразу 9 наших стажёров, будет представлен на Web
                  Summit 2024 в Португалии🔥
                </Typography>
                <Typography sx={styles.metaText}>1 day.</Typography>
              </Box>
            </Box>
            <Box sx={styles.commentsList}>
              <Box sx={styles.commentRow}>
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
                      <NavLink style={styles.usernameLink}>username</NavLink>
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
                <IconButton aria-label="Comment on post" sx={styles.iconButton}>
                  <Box
                    component="img"
                    src={like}
                    alt="like"
                    sx={styles.commentLikeIcon}
                  />
                </IconButton>
              </Box>
              <Box sx={styles.commentRow}>
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
                      <NavLink style={styles.usernameLink}>username</NavLink>
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
                <IconButton aria-label="Comment on post" sx={styles.iconButton}>
                  <Box
                    component="img"
                    src={like}
                    alt="like"
                    sx={styles.commentLikeIcon}
                  />
                </IconButton>
              </Box>
              <Box sx={styles.commentRow}>
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
                      <NavLink style={styles.usernameLink}>username</NavLink>
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
                <IconButton aria-label="Comment on post" sx={styles.iconButton}>
                  <Box
                    component="img"
                    src={like}
                    alt="like"
                    sx={styles.commentLikeIcon}
                  />
                </IconButton>
              </Box>
              <Box sx={styles.commentRow}>
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
                      <NavLink style={styles.usernameLink}>username</NavLink>
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
                <IconButton aria-label="Comment on post" sx={styles.iconButton}>
                  <Box
                    component="img"
                    src={like}
                    alt="like"
                    sx={styles.commentLikeIcon}
                  />
                </IconButton>
              </Box>
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
              <Typography sx={styles.likesCount}>25 likes</Typography>
              <Typography sx={styles.postDate}>1 day</Typography>
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
    </Box>
  );
}

export default MyPostModal;

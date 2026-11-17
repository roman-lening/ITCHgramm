
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import testImage from "../../assets/TestImagePost.svg";
import itchgram from "../../assets/itchgram.png";
import like from "../../assets/DrawerSvg/Light/Notification.svg";
import comment from "../../assets/Comment.svg";
import { styles } from "./styles";

function Post() {
  const count = 234;

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <NavLink to="/userProfile:id" style={styles.profileLink}>
          <Box
            component="img"
            src={itchgram}
            alt="home"
            sx={styles.avatar}
          />

          <Typography sx={styles.username}>
            username
          </Typography>
        </NavLink>

        <Box sx={styles.postInfo}>
          <Divider sx={styles.dot} />

          <Typography sx={styles.postTime}>
            2 wek
          </Typography>

          <Divider sx={styles.dot} />
        </Box>

        <Button sx={styles.followButton}>
          follow
        </Button>
      </Box>

      <Box
        component="img"
        src={testImage}
        alt="home"
        sx={styles.postImage}
      />

      <Box sx={styles.content}>
        <Box sx={styles.actions}>
          <IconButton
            aria-label="Like post"
            sx={styles.iconButton}
          >
            <Box
              component="img"
              src={like}
              alt=""
              sx={styles.actionIcon}
            />
          </IconButton>

          <IconButton
            aria-label="Comment on post"
            sx={styles.iconButton}
          >
            <Box
              component="img"
              src={comment}
              alt=""
              sx={styles.actionIcon}
            />
          </IconButton>
        </Box>

        <Typography sx={styles.likes}>
          {count} likes
        </Typography>

        <Box sx={styles.caption}>
          <Typography sx={styles.username}>
            username
          </Typography>

          <Typography sx={styles.description}>
            description
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Post;


import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import endPosts from "../../assets/endRef.svg";
import { styles } from "./styles";

function EndPosts() {
  return (
    <Box sx={styles.container}>
      <Box
        component="img"
        src={endPosts}
        alt="end"
        sx={styles.image}
      />

      <Box sx={styles.textContainer}>
        <Typography sx={styles.title}>
          You've seen all the updates
        </Typography>

        <Typography sx={styles.description}>
          You have viewed all new publications
        </Typography>
      </Box>
    </Box>
  );
}

export default EndPosts;

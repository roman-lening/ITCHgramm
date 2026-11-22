
import Box from "@mui/material/Box";
import Post from "../../components/Post";
import EndPosts from "../../components/EndPosts";
import { styles } from "./styles";

function Home() {
  return (
    <Box sx={styles.container}>
      <Box sx={styles.postsGrid}>
        {Array.from({ length: 8 }, (_, index) => (
          <Post key={index} />
        ))}
      </Box>

      <EndPosts />
    </Box>
  );
}

export default Home;

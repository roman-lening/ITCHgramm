
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import errorImage from "../../assets/loginImage.png";
import { styles } from "./styles";

function Error() {
  return (
    <Box sx={styles.container}>
      <Box
        component="img"
        src={errorImage}
        alt="errorImage"
        sx={styles.image}
      />

      <Box sx={styles.content}>
        <Typography sx={styles.title}>
          Oops! Page Not Found (404 Error)
        </Typography>

        <Typography sx={styles.description}>
          We're sorry, but the page you're looking for doesn't seem to exist. If
          you typed the URL manually, please double-check the spelling. If you
          clicked on a link, it may be outdated or broken.
        </Typography>
      </Box>
    </Box>
  );
}

export default Error;

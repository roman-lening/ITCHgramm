
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";
import { styles } from "./styles";

function Footer() {
  return (
    <Box sx={styles.footer}>
      <Box sx={styles.navigation}>
        <NavLink to="" style={styles.link}>
          Home
        </NavLink>
        <NavLink to="" style={styles.link}>
          Search
        </NavLink>
        <NavLink to="" style={styles.link}>
          Explore
        </NavLink>
        <NavLink to="" style={styles.link}>
          Messages
        </NavLink>
        <NavLink to="" style={styles.link}>
          Notificaitons
        </NavLink>
        <NavLink to="" style={styles.link}>
          Create
        </NavLink>
      </Box>
      <Typography sx={styles.copyright}>
        © 2026 ITCHgram
      </Typography>
    </Box>
  );
}

export default Footer;

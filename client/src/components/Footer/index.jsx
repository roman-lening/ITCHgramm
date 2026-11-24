import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";
import { styles } from "./styles";

function Footer({ onOpenSearch, onNavigate }) {
  const inactiveLink = {
    ...styles.link,
    cursor: "default",
  };

  const searchButton = {
    ...styles.link,
    padding: 0,
    margin: 0,
    border: "none",
    background: "transparent",
    fontFamily: "inherit",
    textTransform: "none",
    textDecoration: "none",
  };

  return (
    <Box sx={styles.footer}>
      <Box sx={styles.navigation}>
        <NavLink to="/home" onClick={onNavigate} style={styles.link}>
          Home
        </NavLink>
        <Box
          component="button"
          type="button"
          onClick={onOpenSearch}
          sx={searchButton}
        >
          Search
        </Box>
        <NavLink to="/explore" onClick={onNavigate} style={styles.link}>
          Explore
        </NavLink>
        <Typography sx={inactiveLink}>Messages</Typography>
        <Typography sx={inactiveLink}>Notifications</Typography>
        <NavLink to="/add-post" onClick={onNavigate} style={styles.link}>
          Create
        </NavLink>
      </Box>
      <Typography sx={styles.copyright}>© 2026 ITCHgram</Typography>
    </Box>
  );
}

export default Footer;

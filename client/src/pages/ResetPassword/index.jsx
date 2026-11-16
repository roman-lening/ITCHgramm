import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import resetImg from "../../assets/resetPswrd.png";
import { styles } from "./styles";

function ResetPassword() {
  const [login, setLogin] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Box
          component="img"
          src={resetImg}
          alt="reset password"
          sx={styles.logo}
        />
        <Typography sx={styles.title}>
          Trouble logging in?
        </Typography>
        <Typography sx={styles.description}>
          Enter your email, phone, or username and we'll send you a link to get
          back into your account.
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit} sx={styles.form}>
        <TextField
          placeholder="Email or Username"
          required
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          sx={styles.input}
        />
        <Button type="submit" sx={styles.loginButton}>
          Reset your password
        </Button>
      </Box>
      <Box sx={styles.navigation}>
        <Box sx={styles.dividerContainer}>
          <Divider sx={styles.divider} />
          <Typography sx={styles.dividerText}>
            or
          </Typography>
          <Divider sx={styles.divider} />
        </Box>
        <NavLink to="/register" style={styles.createAccount}>
          Create new account
        </NavLink>
      </Box>
      <Box
        component={NavLink}
        to="/login"
        sx={styles.backToLogin}
      >
        Back to login
      </Box>
    </Box>
  );
}

export default ResetPassword;

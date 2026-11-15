import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import itchgram from "../../assets/itchgram.png";
import loginImage from "../../assets/loginImage.png";
import { useState } from "react";
import { styles } from "./styles";

function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Box sx={styles.container}>
      <Box
        component="img"
        src={loginImage}
        alt="login"
        sx={styles.loginImage}
      />

      <Box sx={styles.rightContainer}>
        <Box sx={styles.loginCard}>
          <Box component="img" src={itchgram} alt="itchgram" sx={styles.logo} />

          <Box component="form" onSubmit={handleSubmit} sx={styles.form}>
            <TextField
              placeholder="Username, or email"
              required
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              sx={styles.input}
            />

            <TextField
              placeholder="Password"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={styles.input}
            />
            <Button type="submit" sx={styles.loginButton}>
              Log in
            </Button>
          </Box>

          <Box sx={styles.dividerContainer}>
            <Divider sx={styles.divider} />

            <Typography sx={styles.dividerText}>or</Typography>

            <Divider sx={styles.divider} />
          </Box>

          <NavLink to="" style={styles.forgotPassword}>
            Forgot password?
          </NavLink>
        </Box>

        <Box sx={styles.signupCard}>
          <Typography sx={styles.signupText}>Don't have an account?</Typography>

          <NavLink to="/register" style={styles.signupLink}>
            Sign up
          </NavLink>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;

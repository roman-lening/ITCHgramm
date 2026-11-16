import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { NavLink } from "react-router-dom";
import itchgram from "../../assets/itchgram.png";
import { styles } from "./styles";

function Register() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Box sx={styles.rightContainer}>
      <Box sx={styles.registerCard}>
        <Box component="img" src={itchgram} alt="itchgram" sx={styles.logo} />
        <Typography sx={styles.title}>
          Sign up to see photos and videos from your friends.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={styles.registerForm}>
          <Box sx={styles.form}>
            <TextField
              placeholder="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={styles.input}
            />
            <TextField
              placeholder="Full Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              sx={styles.input}
            />
            <TextField
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={styles.input}
            />
            <TextField
              placeholder="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={styles.input}
            />
          </Box>
          <Box sx={styles.termsContainer}>
            <Typography sx={styles.contactText}>
              People who use our service may have uploaded your contact
              information to ITCHgram.{" "}
              <NavLink to="" style={styles.links}>
                Learn More
              </NavLink>
            </Typography>

            <Typography sx={styles.termsText}>
              By signing up, you agree to our{" "}
              <NavLink to="" style={styles.links}>
                Terms
              </NavLink>
              ,{" "}
              <NavLink to="" style={styles.links}>
                Privacy Policy
              </NavLink>{" "}
              and{" "}
              <NavLink to="" style={styles.links}>
                Cookies Policy
              </NavLink>
              .
            </Typography>
          </Box>

          <Button type="submit" sx={styles.registerButton}>
            Sign up
          </Button>
        </Box>
      </Box>

      <Box sx={styles.loginCard}>
        <Typography sx={styles.loginText}>Have an account?</Typography>

        <NavLink to="/login" style={styles.loginLink}>
          Log in
        </NavLink>
      </Box>
    </Box>
  );
}

export default Register;

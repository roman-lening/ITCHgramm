import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import resetImg from "../../assets/resetPswrd.png";
import { forgotPassword } from "../../redux/slices/authSlice";
import { styles } from "./styles";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!emailRegex.test(cleanEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    try {
      await dispatch(forgotPassword(cleanEmail)).unwrap();

      navigate("/verify-code", {
        state: { email: cleanEmail },
      });
    } catch (error) {
      setError(
        typeof error === "string"
          ? error
          : "Something went wrong. Please try again.",
      );
    }
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

        <Typography sx={styles.title}>Trouble logging in?</Typography>

        <Typography sx={styles.description}>
          Enter your email and we'll send you a verification code to reset your
          password.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={styles.form}>
        <TextField
          placeholder="Email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          sx={styles.input}
        />

        {error && <Typography sx={styles.errorText}>{error}</Typography>}

        <Button type="submit" disabled={loading} sx={styles.loginButton}>
          {loading ? "Sending..." : "Reset your password"}
        </Button>
      </Box>

      <Box sx={styles.navigation}>
        <Box sx={styles.dividerContainer}>
          <Divider sx={styles.divider} />

          <Typography sx={styles.dividerText}>or</Typography>

          <Divider sx={styles.divider} />
        </Box>

        <NavLink to="/register" style={styles.createAccount}>
          Create new account
        </NavLink>
      </Box>

      <Box component={NavLink} to="/login" sx={styles.backToLogin}>
        Back to login
      </Box>
    </Box>
  );
}

export default ResetPassword;

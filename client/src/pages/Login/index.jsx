import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import itchgram from "../../assets/itchgram.png";
import loginImage from "../../assets/loginImage.png";
import { loginUser, clearAuthError } from "../../redux/slices/authSlice";
import { styles } from "./styles";

function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const clearError = () => {
    setFormError("");
    dispatch(clearAuthError());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearError();

    if (!login.trim()) {
      setFormError("Enter your username or email.");
      return;
    }

    if (!password.trim()) {
      setFormError("Enter your password.");
      return;
    }

    try {
      await dispatch(
        loginUser({
          username: login.trim(),
          password,
        }),
      ).unwrap();

      navigate("/profile", { replace: true });
    } catch (error) {
      setFormError(
        typeof error === "string"
          ? error
          : error?.message || "Login failed. Please try again.",
      );
    }
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

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={styles.form}
          >
            <TextField
              placeholder="Username, or email"
              required
              value={login}
              onChange={(e) => {
                setLogin(e.target.value);
                clearError();
              }}
              autoComplete="username"
              sx={styles.input}
            />

            <TextField
              placeholder="Password"
              required
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError();
              }}
              autoComplete="current-password"
              sx={styles.input}
            />

            {formError && (
              <Typography sx={styles.formError}>{formError}</Typography>
            )}

            {location.state?.registered && (
              <Typography sx={styles.successText}>
                Account created successfully. Please log in.
              </Typography>
            )}

            {location.state?.resetSuccess && (
              <Typography sx={styles.successText}>
                Password updated. Please log in.
              </Typography>
            )}

            <Button type="submit" disabled={loading} sx={styles.loginButton}>
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </Box>

          <Box sx={styles.dividerContainer}>
            <Divider sx={styles.divider} />

            <Typography sx={styles.dividerText}>or</Typography>

            <Divider sx={styles.divider} />
          </Box>

          <NavLink to="/reset-password" style={styles.forgotPassword}>
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

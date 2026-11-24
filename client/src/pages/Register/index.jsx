import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import itchgram from "../../assets/itchgram.png";
import {
  registerUser,
  checkUsername,
  clearAuthError,
} from "../../redux/slices/authSlice";
import { styles } from "./styles";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-z0-9_.]+$/;

function Register() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);

  const checkRequest = useRef(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const validateField = (field, value) => {
    if (field === "email") {
      if (!emailRegex.test(value.trim())) {
        return "Enter a valid email address.";
      }
    }

    if (field === "fullName") {
      if (!value.trim()) {
        return "Enter your full name.";
      }

      if (value.trim().length > 100) {
        return "Full name must not exceed 100 characters.";
      }
    }

    if (field === "username") {
      const clean = value.trim().toLowerCase();

      if (clean.length < 3 || clean.length > 30) {
        return "Username must contain 3–30 characters.";
      }

      if (!usernameRegex.test(clean)) {
        return "Use only letters, numbers, underscores and dots.";
      }
    }

    if (field === "password") {
      if (!value.trim()) {
        return "Enter a password.";
      }

      if (value.length < 8) {
        return "Password must contain at least 8 characters.";
      }

      if (new TextEncoder().encode(value).length > 72) {
        return "Password must not exceed 72 bytes.";
      }
    }

    return "";
  };

  const updateField = (field, setter) => (event) => {
    setter(event.target.value);

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    setSubmitError("");

    if (field === "username") {
      checkRequest.current += 1;
      setCheckingUsername(false);
    }
  };

  const handleBlur = (field, value) => {
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  };

  const handleUsernameBlur = async () => {
    const cleanUsername = username.trim().toLowerCase();
    const validationError = validateField("username", cleanUsername);

    if (validationError) {
      handleBlur("username", cleanUsername);
      return;
    }

    const requestId = ++checkRequest.current;
    setCheckingUsername(true);

    try {
      const isTaken = await dispatch(checkUsername(cleanUsername)).unwrap();

      if (requestId !== checkRequest.current) return;

      setErrors((prev) => ({
        ...prev,
        username: isTaken ? "This username is already taken." : "",
      }));
    } catch {
      if (requestId === checkRequest.current) {
        setSubmitError("Could not check username. Please try again.");
      }
    } finally {
      if (requestId === checkRequest.current) {
        setCheckingUsername(false);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = {
      email: validateField("email", email),
      fullName: validateField("fullName", fullName),
      username: validateField("username", username),
      password: validateField("password", password),
    };

    if (
      errors.username === "This username is already taken." &&
      !validationErrors.username
    ) {
      validationErrors.username = errors.username;
    }

    setErrors(validationErrors);
    setSubmitError("");

    if (checkingUsername || Object.values(validationErrors).some(Boolean)) {
      return;
    }

    const cleanUsername = username.trim().toLowerCase();

    try {
      await dispatch(
        registerUser({
          email: email.trim().toLowerCase(),
          fullname: fullName.trim(),
          username: cleanUsername,
          password,
        }),
      ).unwrap();

      navigate("/login", {
        replace: true,
        state: { registered: true },
      });
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : "Registration failed.";

      if (
        errorMessage.toLowerCase().includes("username or email already exists")
      ) {
        try {
          const isTaken = await dispatch(checkUsername(cleanUsername)).unwrap();

          setErrors((prev) => ({
            ...prev,
            [isTaken ? "username" : "email"]: isTaken
              ? "This username is already taken."
              : "This email is already registered.",
          }));
        } catch {
          setSubmitError(errorMessage);
        }
      } else {
        setSubmitError(errorMessage);
      }
    }
  };

  return (
    <Box sx={styles.rightContainer}>
      <Box sx={styles.registerCard}>
        <Box component="img" src={itchgram} alt="itchgram" sx={styles.logo} />

        <Typography sx={styles.title}>
          Sign up to see photos and videos from your friends.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={styles.registerForm}
        >
          <Box sx={styles.form}>
            <Box sx={styles.fieldGroup}>
              <TextField
                placeholder="Email"
                type="email"
                required
                value={email}
                onChange={updateField("email", setEmail)}
                onBlur={() => handleBlur("email", email)}
                autoComplete="email"
                sx={styles.input}
              />

              {errors.email && (
                <Typography sx={styles.fieldError}>{errors.email}</Typography>
              )}
            </Box>

            <Box sx={styles.fieldGroup}>
              <TextField
                placeholder="Full Name"
                required
                value={fullName}
                onChange={updateField("fullName", setFullName)}
                onBlur={() => handleBlur("fullName", fullName)}
                autoComplete="name"
                sx={styles.input}
              />

              {errors.fullName && (
                <Typography sx={styles.fieldError}>
                  {errors.fullName}
                </Typography>
              )}
            </Box>

            <Box sx={styles.fieldGroup}>
              <TextField
                placeholder="Username"
                required
                value={username}
                onChange={updateField("username", setUsername)}
                onBlur={handleUsernameBlur}
                autoComplete="username"
                sx={styles.input}
              />

              {errors.username && (
                <Typography sx={styles.fieldError}>
                  {errors.username}
                </Typography>
              )}
            </Box>

            <Box sx={styles.fieldGroup}>
              <TextField
                placeholder="Password"
                type="password"
                required
                value={password}
                onChange={updateField("password", setPassword)}
                onBlur={() => handleBlur("password", password)}
                autoComplete="new-password"
                sx={styles.input}
              />

              {errors.password && (
                <Typography sx={styles.fieldError}>
                  {errors.password}
                </Typography>
              )}
            </Box>
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

          {submitError && (
            <Typography sx={styles.formError}>{submitError}</Typography>
          )}

          <Button
            type="submit"
            disabled={loading || checkingUsername}
            sx={styles.registerButton}
          >
            {loading ? "Signing up..." : "Sign up"}
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

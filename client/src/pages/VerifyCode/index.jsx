import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import {
  forgotPassword,
  resetPassword,
  loginUser,
} from "../../redux/slices/authSlice";
import { styles } from "./styles.js";

function VerifyCode({ email: emailProp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const email = emailProp ?? location.state?.email;

  const [step, setStep] = useState("code");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(60);

  useEffect(() => {
    if (!email) {
      navigate("/reset-password", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendSeconds === 0) return;

    const timer = setTimeout(() => {
      setResendSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendSeconds]);

  const handleChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 6);

    setCode(value);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (step === "code") {
      if (code.length !== 6) {
        setError("Enter the 6-digit verification code.");
        return;
      }

      setStep("password");
      return;
    }

    if (!email) {
      setError("Email is missing.");
      return;
    }

    if (!newPassword.trim()) {
      setError("Enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (new TextEncoder().encode(newPassword).length > 72) {
      setError("Password must not exceed 72 bytes.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await dispatch(
        resetPassword({
          email,
          code,
          newPassword,
        }),
      ).unwrap();

      try {
        await dispatch(
          loginUser({
            username: email,
            password: newPassword,
          }),
        ).unwrap();

        navigate("/profile", { replace: true });
      } catch {
        navigate("/login", {
          replace: true,
          state: { resetSuccess: true },
        });
      }
    } catch (error) {
      setError(
        typeof error === "string"
          ? error
          : "Password reset failed. Please check your code.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendSeconds > 0 || resendLoading) return;

    setError("");
    setMessage("");

    if (!email) {
      setError("Email is missing.");
      return;
    }

    setResendLoading(true);

    try {
      await dispatch(forgotPassword(email)).unwrap();

      setResendSeconds(60);
      setCode("");
      setNewPassword("");
      setConfirmPassword("");
      setStep("code");
      setMessage("A new code has been requested.");
    } catch (error) {
      setError(
        typeof error === "string" ? error : "Could not resend the code.",
      );
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToCode = () => {
    setStep("code");
    setError("");
    setMessage("");
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Box sx={styles.logoCircle}>
          <MailOutlinedIcon sx={styles.mailIcon} />
        </Box>

        <Typography sx={styles.title}>
          {step === "code" ? "Enter the code" : "Create new password"}
        </Typography>

        <Typography sx={styles.description}>
          {step === "code"
            ? "We sent a 6-digit verification code to your email. Enter it below to restore access to your account."
            : "Enter and confirm your new password to restore access to your account."}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={styles.form}>
        {step === "code" ? (
          <TextField
            placeholder="Verification code"
            required
            value={code}
            onChange={handleChange}
            autoComplete="one-time-code"
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
                pattern: "[0-9]*",
                maxLength: 6,
                "aria-label": "Verification code",
              },
            }}
            sx={styles.input}
          />
        ) : (
          <>
            <TextField
              placeholder="New password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError("");
              }}
              autoComplete="new-password"
              sx={styles.input}
            />

            <TextField
              placeholder="Confirm new password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              autoComplete="new-password"
              sx={styles.input}
            />
          </>
        )}

        {error && <Typography sx={styles.errorText}>{error}</Typography>}

        <Button type="submit" disabled={loading} sx={styles.verifyButton}>
          {loading
            ? "Saving..."
            : step === "code"
              ? "Enter"
              : "Save new password"}
        </Button>
      </Box>

      {step === "password" && (
        <Button
          onClick={handleBackToCode}
          disabled={loading}
          sx={styles.changeCodeButton}
        >
          Change code
        </Button>
      )}

      <Box sx={styles.navigation}>
        <Typography sx={styles.resendText}>Didn't receive the code?</Typography>

        <Button
          onClick={handleResend}
          disabled={resendSeconds > 0 || resendLoading || loading}
          sx={styles.resendButton}
        >
          {resendLoading
            ? "Sending..."
            : resendSeconds > 0
              ? `Resend code (${resendSeconds}s)`
              : "Resend code"}
        </Button>
      </Box>

      {message && <Typography sx={styles.messageText}>{message}</Typography>}

      <Box component={NavLink} to="/login" sx={styles.backToLogin}>
        Back to login
      </Box>
    </Box>
  );
}

export default VerifyCode;


import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import { styles } from "./styles.js";

function VerifyCode({ onVerify, onResend }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(60);

  const navigate = useNavigate();

  useEffect(() => {
    if (resendSeconds === 0) return;

    const timer = setTimeout(() => {
      setResendSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendSeconds]);

  const handleChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setCode(value);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (code.length !== 6) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    if (!onVerify) {
      setError("Code verification is not connected yet.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const verified = await onVerify(code);

      if (verified === true) {
        navigate("/profile");
      } else {
        setError("Incorrect or expired verification code.");
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendSeconds > 0 || resendLoading) return;

    setError("");
    setMessage("");

    if (!onResend) {
      setMessage("Resending is not connected yet.");
      return;
    }

    setResendLoading(true);

    try {
      await onResend();
      setResendSeconds(60);
      setMessage("A new code has been sent.");
    } catch {
      setError("Could not resend the code.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Box sx={styles.logoCircle}>
          <MailOutlinedIcon sx={styles.mailIcon} />
        </Box>

        <Typography sx={styles.title}>
          Enter the code
        </Typography>

        <Typography sx={styles.description}>
          We sent a 6-digit verification code to your email.
          Enter it below to restore access to your account.
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={styles.form}
      >
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

        {error && (
          <Typography sx={styles.errorText}>
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          disabled={loading}
          sx={styles.verifyButton}
        >
          {loading ? "Verifying..." : "Enter"}
        </Button>
      </Box>

      <Box sx={styles.navigation}>
        <Typography sx={styles.resendText}>
          Didn't receive the code?
        </Typography>

        <Button
          onClick={handleResend}
          disabled={resendSeconds > 0 || resendLoading}
          sx={styles.resendButton}
        >
          {resendLoading
            ? "Sending..."
            : resendSeconds > 0
              ? `Resend code (${resendSeconds}s)`
              : "Resend code"}
        </Button>
      </Box>

      {message && (
        <Typography sx={styles.messageText}>
          {message}
        </Typography>
      )}

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

export default VerifyCode;

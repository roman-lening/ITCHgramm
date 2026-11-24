import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import itchgram from "../../assets/itchgram.png";
import linkWebImg from "../../assets/linkWeb.svg";
import {
  getMyProfile,
  updateMyProfile,
} from "../../redux/slices/profileSlice.js";
import { styles } from "./styles";

function EditProfileForm({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { saving } = useSelector((state) => state.profile);
  const [username, setUsername] = useState(user.username ?? "");
  const [website, setWebsite] = useState(user.website ?? "");
  const [about, setAbout] = useState(user.bio ?? "");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const clearError = (field) => {
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    setSubmitError("");
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        avatar: "Only JPEG, PNG and WebP images are allowed.",
      }));
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        avatar: "Image must not exceed 2 MB.",
      }));
      event.target.value = "";
      return;
    }

    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
    clearError("avatar");
    event.target.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    const cleanUsername = username.trim().toLowerCase();
    const cleanWebsite = website.trim();
    const cleanAbout = about.trim();
    const validationErrors = {};
    if (!/^[a-z0-9_.]{3,30}$/.test(cleanUsername)) {
      validationErrors.username =
        "Username must contain 3–30 letters, numbers, dots or underscores.";
    }
    if (cleanWebsite.length > 200) {
      validationErrors.website = "Website must not exceed 200 characters.";
    } else if (cleanWebsite) {
      try {
        const url = new URL(
          /^https?:\/\//i.test(cleanWebsite)
            ? cleanWebsite
            : `https://${cleanWebsite}`,
        );

        if (!["http:", "https:"].includes(url.protocol)) {
          validationErrors.website = "Enter a valid website URL.";
        }
      } catch {
        validationErrors.website = "Enter a valid website URL.";
      }
    }
    if (cleanAbout.length > 150) {
      validationErrors.about = "About must not exceed 150 characters.";
    }
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    try {
      await dispatch(
        updateMyProfile({
          username: cleanUsername,
          website: cleanWebsite,
          bio: cleanAbout,
          avatar,
        }),
      ).unwrap();
      navigate("/profile", { replace: true });
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Failed to update profile.";

      if (errorMessage === "Username already exists") {
        setErrors((prev) => ({
          ...prev,
          username: "This username is already taken.",
        }));
      } else {
        setSubmitError(errorMessage);
      }
    }
  };

  return (
    <Box sx={styles.container}>
      <Typography sx={styles.title}>Edit profile</Typography>
      <Box sx={styles.profilePreview}>
        <Box sx={styles.profileInfo}>
          <Box
            component="img"
            src={avatarPreview || user.avatarUrl || itchgram}
            alt="Profile avatar"
            sx={styles.avatar}
          />
          <Box sx={styles.profileDetails}>
            <Typography sx={styles.profileUsername}>
              {username || user.username}
            </Typography>
            <Typography sx={styles.profileDescription}>{about}</Typography>
          </Box>
        </Box>
        <Box
          component="input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          ref={fileInputRef}
          onChange={handlePhotoChange}
          sx={styles.fileInput}
        />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={saving}
          sx={styles.newPhotoButton}
        >
          New photo
        </Button>
      </Box>
      {errors.avatar && (
        <Typography sx={styles.fieldError}>{errors.avatar}</Typography>
      )}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={styles.form}>
        <Box sx={styles.fieldGroup}>
          <Typography sx={styles.title}>Username</Typography>

          <TextField
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
              clearError("username");
            }}
            slotProps={{
              htmlInput: {
                maxLength: 30,
              },
            }}
            sx={styles.usernameInput}
          />
          {errors.username && (
            <Typography sx={styles.fieldError}>{errors.username}</Typography>
          )}
        </Box>
        <Box sx={styles.fieldGroup}>
          <Typography sx={styles.title}>Website</Typography>
          <TextField
            value={website}
            onChange={(event) => {
              setWebsite(event.target.value);
              clearError("website");
            }}
            slotProps={{
              htmlInput: {
                maxLength: 200,
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      component="img"
                      src={linkWebImg}
                      alt=""
                      sx={styles.linkIcon}
                    />
                  </InputAdornment>
                ),
              },
            }}
            sx={styles.websiteInput}
          />
          {errors.website && (
            <Typography sx={styles.fieldError}>{errors.website}</Typography>
          )}
        </Box>
        <Box sx={styles.fieldGroup}>
          <Typography sx={styles.title}>About</Typography>
          <Box sx={styles.aboutContainer}>
            <TextField
              value={about}
              onChange={(event) => {
                setAbout(event.target.value.slice(0, 150));
                clearError("about");
              }}
              multiline
              minRows={1}
              maxRows={3}
              slotProps={{
                htmlInput: {
                  maxLength: 150,
                },
              }}
              sx={styles.aboutInput}
            />
            <Typography sx={styles.aboutCounter}>
              {about.length} / 150
            </Typography>
          </Box>
          {errors.about && (
            <Typography sx={styles.fieldError}>{errors.about}</Typography>
          )}
        </Box>
        {submitError && (
          <Typography sx={styles.fieldError}>{submitError}</Typography>
        )}
        <Button type="submit" disabled={saving} sx={styles.saveButton}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
}

function EditProfile() {
  const dispatch = useDispatch();
  const { myProfile, loading, error } = useSelector((state) => state.profile);
  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);
  if (loading) {
    return (
      <Box sx={styles.container}>
        <Typography sx={styles.statusText}>Loading profile...</Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={styles.container}>
        <Typography sx={styles.statusText}>{error}</Typography>
      </Box>
    );
  }
  if (!myProfile?.user) {
    return (
      <Box sx={styles.container}>
        <Typography sx={styles.statusText}>Loading profile...</Typography>
      </Box>
    );
  }
  return <EditProfileForm key={myProfile.user.id} user={myProfile.user} />;
}

export default EditProfile;

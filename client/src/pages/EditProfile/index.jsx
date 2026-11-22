import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { useState } from "react";
import itchgram from "../../assets/itchgram.png";
import linkWebImg from "../../assets/linkWeb.svg";
import { styles } from "./styles";

function EditProfile() {
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [about, setAbout] = useState("");

  return (
    <Box sx={styles.container}>
      <Typography sx={styles.title}>Edit profile</Typography>

      <Box sx={styles.profilePreview}>
        <Box sx={styles.profileInfo}>
          <Box
            component="img"
            src={itchgram}
            alt="itchgram"
            sx={styles.avatar}
          />

          <Box sx={styles.profileDetails}>
            <Typography sx={styles.profileUsername}>username</Typography>

            <Typography sx={styles.profileDescription}>
              • Гарантия помощи с трудоустройством в ведущие IT-компанииГарантия
              помощи с трудоустройством в ведущие IT-компанииГарантия помощи с
              трудоустройством в ведущие IT-компании
            </Typography>
          </Box>
        </Box>

        <Button sx={styles.newPhotoButton}>New photo</Button>
      </Box>

      <Box component="form" sx={styles.form}>
        <Box sx={styles.fieldGroup}>
          <Typography sx={styles.title}>Username</Typography>

          <TextField
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={styles.usernameInput}
          />
        </Box>

        <Box sx={styles.fieldGroup}>
          <Typography sx={styles.title}>Website</Typography>

          <TextField
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            slotProps={{
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
        </Box>

        <Box sx={styles.fieldGroup}>
          <Typography sx={styles.title}>About</Typography>

          <Box sx={styles.aboutContainer}>
            <TextField
              value={about}
              onChange={(e) => setAbout(e.target.value.slice(0, 150))}
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
        </Box>

        <Button sx={styles.saveButton}>Save</Button>
      </Box>
    </Box>
  );
}

export default EditProfile;

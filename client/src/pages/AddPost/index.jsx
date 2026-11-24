import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import itchgram from "../../assets/itchgram.png";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import AddImg from "../../assets/addPostFoto.svg";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { useState } from "react";

function AddPost() {
  const [desc, setDesc] = useState("");

  return (
    <Box
      sx={{
        display: "flex",
        margin: "0 auto",
        marginTop: "148px",
        width: "913px",
        marginRight: "137px",
        marginBottom: "476px",
        height: "564px",
        flexDirection: "column",
        borderRadius: "12px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          borderBottom: "1px solid #dbdbdb",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingRight: "16px",
          paddingTop: "12px",
          paddingBottom: "12px",
          gap: "308px",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "150%",
            textAlign: "center",
            color: "#000",
          }}
        >
          Create new post
        </Typography>
        <Button
          sx={{
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "129%",
            textAlign: "right",
            color: "#0095f6",
            textTransform: "none",
          }}
        >
          Share
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "573px",
            height: "100%",
            borderBottom: "1px solid #dbdbdb",
          }}
        >
          <Box
            component="img"
            src={AddImg}
            alt="itchgram"
            sx={{
              width: "153px",
              height: "153px",
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            paddingTop: "18px",
            paddingLeft: "16px",
            paddingRight: "12px",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: "339px",
            borderLeft: "1px solid #dbdbdb",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Box
              component="img"
              src={itchgram}
              alt="itchgram"
              sx={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                border: "1px solid black",
              }}
            />
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "129%",
                color: "#000",
              }}
            >
              username
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              paddingRight: "8px",
            }}
          >
            <IconButton aria-label="Choose emoji" sx={{ padding: 0 }}>
              <SentimentSatisfiedAltOutlinedIcon sx={{}} />
            </IconButton>
            <TextField
              placeholder="Add comment"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              sx={{}}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AddPost;

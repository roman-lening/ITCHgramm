import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { NavLink } from "react-router-dom";
import List from "@mui/material/List";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import itchgram from "../../assets/itchgram.png";
import { styles } from "./styles";
import homeLight from "../../assets/DrawerSvg/Light/Home.svg";
import searchLight from "../../assets/DrawerSvg/Light/Search.svg";
import exploreLight from "../../assets/DrawerSvg/Light/Explore.svg";
import messageLight from "../../assets/DrawerSvg/Light/Message.svg";
import notificationLight from "../../assets/DrawerSvg/Light/Notification.svg";
import create from "../../assets/DrawerSvg/Light/Create.svg";
import homeDark from "../../assets/DrawerSvg/Dark/Home.svg";
import searchDark from "../../assets/DrawerSvg/Dark/Search.svg";
import exploreDark from "../../assets/DrawerSvg/Dark/Explore.svg";
import messageDark from "../../assets/DrawerSvg/Dark/Message.svg";
import notificationDark from "../../assets/DrawerSvg/Dark/Notification.svg";
import { useState } from "react";

function Drawerr() {
  const [isHome, setIsHome] = useState(true);
  const [isProfile, setIsProfile] = useState(true);
  const [isExplore, setIsExplore] = useState(true);
  const [isNotification, setIsNotification] = useState(true);
  const [openSearch, setOpenSearch] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);

  const handleProfile = () => {
    setIsProfile(false);
    setIsHome(true);
    setIsExplore(true);
    setIsNotification(true);
    setOpenSearch(false);
    setOpenMessage(false);
  };

  const handleHome = () => {
    setIsProfile(true);
    setIsHome(false);
    setIsExplore(true);
    setIsNotification(true);
    setOpenSearch(false);
    setOpenMessage(false);
  };

  const handleExplore = () => {
    setIsHome(true);
    setIsProfile(true);
    setIsExplore(!isExplore);
    setIsNotification(true);
    setOpenSearch(false);
    setOpenMessage(false);
  };

  const handleNotification = () => {
    setIsHome(true);
    setIsProfile(true);
    setIsExplore(true);
    setOpenSearch(false);
    setOpenMessage(false);
    setIsNotification(!isNotification);
  };

  const handleSearch = () => {
    setIsHome(true);
    setIsProfile(true);
    setIsExplore(true);
    setIsNotification(true);
    setOpenSearch(!openSearch);
    setOpenMessage(false);
  };

  const handleMessage = () => {
    setIsHome(true);
    setIsProfile(true);
    setIsExplore(true);
    setIsNotification(true);
    setOpenMessage(!openMessage);
    setOpenSearch(false);
  };

  return (
    <Box sx={styles.container}>
      <Drawer sx={styles.mainDrawer} variant="permanent" anchor="left">
        <Box component="img" src={itchgram} alt="itchgram" sx={styles.logo} />

        <List>
          <NavLink to="/home" onClick={handleHome} style={styles.item}>
            <Box
              component="img"
              src={isHome ? homeLight : homeDark}
              alt="home"
              sx={styles.icon}
            />
            <Typography sx={styles.text(isHome ? 400 : 700)}>Home</Typography>
          </NavLink>

          <Button onClick={handleSearch} sx={styles.item}>
            <Box
              component="img"
              src={!openSearch ? searchLight : searchDark}
              alt="search"
              sx={styles.icon}
            />
            <Typography sx={styles.text(!openSearch ? 400 : 700)}>
              Search
            </Typography>
          </Button>

          <NavLink to="/explore" onClick={handleExplore} style={styles.item}>
            <Box
              component="img"
              src={isExplore ? exploreLight : exploreDark}
              alt="explore"
              sx={styles.icon}
            />
            <Typography sx={styles.text(isExplore ? 400 : 700)}>
              Explore
            </Typography>
          </NavLink>

          <NavLink to="/messages" onClick={handleMessage} style={styles.item}>
            <Box
              component="img"
              src={!openMessage ? messageLight : messageDark}
              alt="message"
              sx={styles.icon}
            />
            <Typography sx={styles.text(!openMessage ? 400 : 700)}>
              Messages
            </Typography>
          </NavLink>
          <Button onClick={handleNotification} sx={styles.item}>
            <Box
              component="img"
              src={isNotification ? notificationLight : notificationDark}
              alt="notification"
              sx={styles.icon}
            />
            <Typography sx={styles.text(isNotification ? 400 : 700)}>
              Notifications
            </Typography>
          </Button>

          <Button sx={styles.item}>
            <Box component="img" src={create} alt="create" sx={styles.icon} />
            <Typography sx={styles.text(400)}>Create</Typography>
          </Button>
        </List>

        <NavLink onClick={handleProfile} style={styles.item}>
          <Box
            component="img"
            src={itchgram}
            alt="itchgram"
            sx={styles.profileIcon}
          />
          <Typography sx={styles.text(isProfile ? 400 : 700)}>
            Profile
          </Typography>
        </NavLink>
      </Drawer>

      <Drawer
        variant="temporary"
        anchor="left"
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        transitionDuration={{ enter: 450, exit: 350 }}
        sx={styles.searchDrawer}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "24px",
            lineHeight: "125%",
            color: "#000",
            paddingLeft: "8px",
          }}
        >
          Search
        </Typography>
        <InputBase
          type="search"
          placeholder="Search"
          fullWidth
          inputProps={{ "aria-label": "Search users" }}
          sx={{
            fontSize: "16px",
            color: "#737373",
            fontWeight: 300,
            background: "#efefef",
            borderRadius: "8px",
            width: "100%",
            paddingLeft: "16px",
            paddingRight: "16px",
            paddingTop: "10.5px",
            paddingBottom: "10.5px",
            "& input::-webkit-search-cancel-button": {
              WebkitAppearance: "none",
              appearance: "none",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#C4C4C4",
              cursor: "pointer",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M18 6 6 18M6 6l12 12' stroke='white' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundSize: "12px",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            },
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "26px",
            alignItems: "flex-start",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "16px",
              lineHeight: "125%",
              color: "#000",
            }}
          >
            Recent
          </Typography>
          <Box>
            <NavLink
              to="/userProfile:id"
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Box
                component="img"
                src={itchgram}
                alt="itchgram"
                sx={{
                  borderRadius: "19px",
                  width: "38px",
                  height: "38px",
                }}
              />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: "129%",
                  color: "#000",
                }}
              >
                username
              </Typography>
            </NavLink>
          </Box>
        </Box>
      </Drawer>

      <Drawer
        variant="persistent"
        anchor="left"
        open={openMessage}
        transitionDuration={{ enter: 450, exit: 350 }}
        sx={styles.messageDrawer}
      >
        <Typography>Messages</Typography>
      </Drawer>
    </Box>
  );
}

export default Drawerr;

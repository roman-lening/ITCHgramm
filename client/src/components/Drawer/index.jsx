import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { NavLink } from "react-router-dom";
import List from "@mui/material/List";
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
        variant="persistent"
        anchor="left"
        open={openSearch}
        sx={styles.searchDrawer}
      >
        <Typography>Search</Typography>
      </Drawer>

      <Drawer
        variant="persistent"
        anchor="left"
        open={openMessage}
        sx={styles.messageDrawer}
      >
        <Typography>Messages</Typography>
      </Drawer>
    </Box>
  );
}

export default Drawerr;

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { NavLink, useLocation } from "react-router-dom";
import List from "@mui/material/List";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { searchUsers, clearSearch } from "../../redux/slices/searchSlice.js";

const searchInputStyles = {
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
};

const sectionStyles = {
  display: "flex",
  flexDirection: "column",
  gap: "26px",
  alignItems: "flex-start",
  width: "100%",
};

const sectionTitleStyles = {
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "125%",
  color: "#000",
};

const resultStyles = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "8px",
  width: "100%",
  textDecoration: "none",
  cursor: "pointer",
};

const resultAvatarStyles = {
  borderRadius: "50%",
  width: "38px",
  height: "38px",
  objectFit: "cover",
  flexShrink: 0,
};

const resultUsernameStyles = {
  fontWeight: 700,
  fontSize: "14px",
  lineHeight: "129%",
  color: "#000",
};

const resultFullnameStyles = {
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "129%",
  color: "#737373",
};

function Drawerr({ openSearch, setOpenSearch }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const currentUserId = useSelector((state) => state.auth.userId);

  const { users, query, loading, error } = useSelector((state) => state.search);

  const [isNotification, setIsNotification] = useState(true);
  const [openMessage, setOpenMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentUsers, setRecentUsers] = useState([]);

  const isHome = location.pathname !== "/home";
  const isProfile = location.pathname !== "/profile";
  const isExplore = location.pathname !== "/explore";

  const trimmedQuery = searchQuery.trim();

  const resultsAreCurrent = query === trimmedQuery;

  const searchLoading =
    Boolean(trimmedQuery) && (!resultsAreCurrent || loading);

  useEffect(() => {
    if (!openSearch || !trimmedQuery) {
      dispatch(clearSearch());
      return;
    }

    let request;

    const timeout = setTimeout(() => {
      request = dispatch(searchUsers(trimmedQuery));
    }, 300);

    return () => {
      clearTimeout(timeout);
      request?.abort();
    };
  }, [dispatch, openSearch, trimmedQuery]);

  const closePanels = () => {
    setOpenSearch(false);
    setOpenMessage(false);
    setSearchQuery("");
    setIsNotification(true);
  };

  const handleSearch = () => {
    setOpenSearch((previous) => !previous);
    setOpenMessage(false);
    setIsNotification(true);
  };

  const handleMessage = () => {
    setOpenMessage((previous) => !previous);
    setOpenSearch(false);
    setIsNotification(true);
  };

  const handleNotification = () => {
    setIsNotification((previous) => !previous);
    setOpenSearch(false);
    setOpenMessage(false);
  };

  const getProfilePath = (user) => {
    if (user._id === currentUserId) {
      return "/profile";
    }

    return `/profile/${encodeURIComponent(user.username)}`;
  };

  const handleSelectUser = (user) => {
    setRecentUsers((previous) => {
      const withoutCurrentUser = previous.filter(
        (item) => item._id !== user._id,
      );

      return [user, ...withoutCurrentUser].slice(0, 5);
    });

    setSearchQuery("");
    setOpenSearch(false);
    setOpenMessage(false);
    setIsNotification(true);
  };

  const renderUser = (user) => (
    <NavLink
      key={user._id}
      to={getProfilePath(user)}
      onClick={() => handleSelectUser(user)}
      style={resultStyles}
    >
      <Box
        component="img"
        src={user.avatarUrl || itchgram}
        alt={user.username}
        sx={resultAvatarStyles}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Typography sx={resultUsernameStyles}>{user.username}</Typography>

        {user.fullname && (
          <Typography sx={resultFullnameStyles}>{user.fullname}</Typography>
        )}
      </Box>
    </NavLink>
  );

  return (
    <Box sx={styles.container}>
      <Drawer sx={styles.mainDrawer} variant="permanent" anchor="left">
        <Box component="img" src={itchgram} alt="itchgram" sx={styles.logo} />

        <List>
          <NavLink to="/home" onClick={closePanels} style={styles.item}>
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

          <NavLink to="/explore" onClick={closePanels} style={styles.item}>
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

          <Button onClick={handleMessage} sx={styles.item}>
            <Box
              component="img"
              src={!openMessage ? messageLight : messageDark}
              alt="message"
              sx={styles.icon}
            />

            <Typography sx={styles.text(!openMessage ? 400 : 700)}>
              Messages
            </Typography>
          </Button>

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

          <Button
            component={NavLink}
            to="/add-post"
            onClick={closePanels}
            sx={styles.item}
          >
            <Box component="img" src={create} alt="create" sx={styles.icon} />
            <Typography sx={styles.text(400)}>Create</Typography>
          </Button>
        </List>

        <NavLink to="/profile" onClick={closePanels} style={styles.item}>
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
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
          }}
          inputProps={{
            "aria-label": "Search users",
          }}
          sx={searchInputStyles}
        />

        <Box sx={sectionStyles}>
          <Typography sx={sectionTitleStyles}>
            {trimmedQuery ? "Results" : "Recent"}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              width: "100%",
            }}
          >
            {!trimmedQuery &&
              (recentUsers.length > 0 ? (
                recentUsers.map(renderUser)
              ) : (
                <Typography sx={resultFullnameStyles}>
                  No recent searches.
                </Typography>
              ))}

            {trimmedQuery && searchLoading && (
              <Typography sx={resultFullnameStyles}>Searching...</Typography>
            )}

            {trimmedQuery && !searchLoading && error && (
              <Typography
                sx={{
                  ...resultFullnameStyles,
                  color: "#ed4956",
                }}
              >
                {error}
              </Typography>
            )}

            {trimmedQuery && !searchLoading && !error && users.length === 0 && (
              <Typography sx={resultFullnameStyles}>No users found.</Typography>
            )}

            {trimmedQuery && !searchLoading && !error && users.map(renderUser)}
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

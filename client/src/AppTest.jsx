import Footer from "./components/Footer";
import Box from "@mui/material/Box";
import Login from "./pages/Login";
// import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Drawerr from "./components/Drawer";
import Post from "./components/Post";
import EndPosts from "./components/EndPosts";
import OtherProfile from "./pages/OtherProfile";
import MyProfile from "./pages/MyProfile";
import OtherPostModal from "./pages/OtherPostModal";
import MyPostModal from "./pages/MyPostModal";
import Explore from "./pages/Explore";
import Home from "./pages/Home";
import VerifyCode from "./pages/VerifyCode";
import Error from "./pages/Error";

function AppTest() {
  return (
    <Box>
      <Login />
      <Register />
      <ResetPassword />
      <VerifyCode />
      <Post />
      <EndPosts />
      <OtherProfile />
      <MyProfile />
      <OtherPostModal />
      <MyPostModal />
      <Explore />
      <Home />
      <Error />
      <Footer />
      <Drawerr />
    </Box>
  );
}

export default AppTest;

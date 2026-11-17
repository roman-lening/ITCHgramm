import Footer from "./components/Footer";
import Box from "@mui/material/Box";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Drawerr from "./components/Drawer";
import Post from "./components/Post";
import EndPosts from "./components/EndPosts";

function AppTest() {
  return (
    <Box>
      <Login />
      <Register />
      <ResetPassword />
      <Post />
      <EndPosts />
      <Footer />
      <Drawerr />
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
        {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
      </Routes>
    </Box>
  );
}

export default AppTest;

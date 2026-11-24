import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Drawerr from "./components/Drawer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import VerifyCode from "./pages/VerifyCode";
import MyProfile from "./pages/MyProfile";
import OtherProfile from "./pages/OtherProfile";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import EditProfile from "./pages/EditProfile";
import AddPost from "./pages/AddPost";
import Error from "./pages/Error";

function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
function StartPage() {
  const token = useSelector((state) => state.auth.token);
  return <Navigate to={token ? "/profile" : "/login"} replace />;
}

function AppLayout() {
  return (
    <Box>
      <Drawerr />
      <Outlet />
      <Footer />
    </Box>
  );
}

function AppTest() {
  return (
    <Box>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/profile/:username" element={<OtherProfile />} />
          <Route path="/home" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/add-post" element={<AddPost />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </Box>
  );
}

export default AppTest;

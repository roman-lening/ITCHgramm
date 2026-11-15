import Footer from "./components/Footer";
import Box from "@mui/material/Box";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";

function AppTest() {
  return (
    <Box>
      <Login />
      <Register />
      <ResetPassword />
      <Footer />
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
        {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
      </Routes>
    </Box>
  );
}

export default AppTest;

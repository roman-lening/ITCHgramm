import Footer from "./components/Footer";
import Box from "@mui/material/Box";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";

function AppTest() {
  return (
    <Box>
      <Login />
      <Register />
      <Footer />
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
      </Routes>
    </Box>
  );
}

export default AppTest;

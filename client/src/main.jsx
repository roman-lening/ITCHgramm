import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppTest from "./AppTest.jsx";
import store from "./redux/store.js";
import { BrowserRouter } from "react-router-dom";

const isTestPage = window.location.pathname === "/test";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>{isTestPage ? <AppTest /> : <App />}</BrowserRouter>
  </Provider>,
);

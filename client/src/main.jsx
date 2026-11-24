import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import AppTest from "./AppTest.jsx";
import store from "./redux/store.js";

const path = window.location.pathname;
const isTestPage = path === "/test" || path.startsWith("/test/");

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter basename={isTestPage ? "/test" : "/"}>
      {isTestPage ? <AppTest /> : <App />}
    </BrowserRouter>
  </Provider>,
);

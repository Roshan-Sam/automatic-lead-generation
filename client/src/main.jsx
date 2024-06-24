import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AdminProfileContextProvider } from "./context/adminProfileContext.jsx";
import { AdminNotificationContextProvider } from "./context/adminNotificationContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AdminNotificationContextProvider>
      <AdminProfileContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AdminProfileContextProvider>
    </AdminNotificationContextProvider>
  </React.StrictMode>
);

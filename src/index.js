import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter

// Context Providers
import UserContextProvider from "./context/user";
import ListContextProvider from "./context/list";
import TabContextProvider from "./context/tab";
import ThemeContextProvider from "./context/theme";

// Bootstrap and CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./css/listcard.css";
import "./css/sign-in.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeContextProvider>
        <UserContextProvider>
          <ListContextProvider>
            <TabContextProvider>
              <App />
            </TabContextProvider>
          </ListContextProvider>
        </UserContextProvider>
      </ThemeContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

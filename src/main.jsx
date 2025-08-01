import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GlobalStyles from "./styles/GlobalStyles";
import { AuthProvider } from "./context/AuthContext";
import { StreakProvider } from "./context/StreakContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <StreakProvider>
        <GlobalStyles />
        <App />
      </StreakProvider>
    </AuthProvider>
  </React.StrictMode>
);

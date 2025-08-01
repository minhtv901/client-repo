// src/App.jsx
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomePage from "./pages/HomePage";
import ChecklistPage from "./pages/ChecklistPage";
import JournalPage from "./pages/JournalPage";
import MilestonePage from "./pages/MilestonePage";
import UserInfoPage from "./pages/UserInfoPage";
import AuthPopup from "./components/AuthPopup";
import StreakPopup from "./components/StreakPopup";
import { useAuth } from "./context/AuthContext";
import "./App.css";

function App() {
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const { user, logout } = useAuth();
  const handleLoginClick = () => setShowAuthPopup(true);
  const handleLogoutClick = () => logout();
  const handleShowStreakClick = () => setShowStreakPopup(true);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar
          user={user}
          onLoginClick={handleLoginClick}
          onLogoutClick={handleLogoutClick}
          onShowStreakClick={handleShowStreakClick}
        />

        {!sidebarOpen && (
          <IconButton
            onClick={() => setSidebarOpen(true)}
            sx={{
              position: "fixed",
              top: 90,
              left: 10,
              zIndex: 1201,
              background: "#fff",
              boxShadow: 1,
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        )}

        {/* Sidebar Drawer */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="main-content">
          <div className="page-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/checklist" element={<ChecklistPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/milestones" element={<MilestonePage />} />
              <Route path="/user-info" element={<UserInfoPage />} />
            </Routes>
          </div>
        </div>

        {showAuthPopup && <AuthPopup onClose={() => setShowAuthPopup(false)} />}
        {showStreakPopup && <StreakPopup onClose={() => setShowStreakPopup(false)} />}
      </div>
    </BrowserRouter>
  );
}

export default App;

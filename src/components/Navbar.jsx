import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthPopup from "./AuthPopup";
import "../../css/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">🔥 Mind Clean</Link>
        <Link to="/journal" className="navbar-link">Journal</Link>
        <Link to="/checklist" className="navbar-link">Checklist</Link>
        <Link to="/user-info" className="navbar-link">Profile</Link>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <span className="navbar-user">Hello, {user.username}</span>
            <button className="navbar-button" onClick={logout}>Logout</button>
          </>
        ) : (
          <button className="navbar-button" onClick={() => setShowPopup(true)}>Login / Register</button>
        )}
        {showPopup && <AuthPopup onClose={() => setShowPopup(false)} />}
      </div>
    </nav>
  );
}

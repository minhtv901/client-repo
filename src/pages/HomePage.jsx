import React, { useState } from "react";
import { useStreak } from "../context/StreakContext";
import CheckinPopup from "../components/StreakPopup";
import "../../css/HomePage.css"; // Make sure you have this CSS file for homepage styling

export default function Home() {
  const { streak, increaseStreak, resetStreak } = useStreak();
  const [showPopup, setShowPopup] = useState(false);
  const [popupStreak, setPopupStreak] = useState(null);
  const [popupStatus, setPopupStatus] = useState(""); // "success" | "already"
  const isLoggedIn = streak && typeof streak.currentStreak === "number";

  const handleStart = async () => {
    try {
      const res = await increaseStreak();
      setPopupStreak(res.data || streak);
      setPopupStatus(res.status || "success");
      setShowPopup(true);
    } catch (error) {
      alert("An error occurred while increasing your streak!");
    }
  };

  const handleRelapse = async () => {
    if (!isLoggedIn) {
      setPopupStatus("notLoggedIn");
      setShowPopup(true);
      return;
    }
    try {
      await resetStreak();
      setPopupStatus("relapse");
      setShowPopup(true);
    } catch (error) {
      alert("An error occurred while resetting your streak!");
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Mind Clean!</h1>
      <div className="home-btn-group">
        <button className="home-btn" onClick={handleStart}>
          Start a new streak / Increase streak
        </button>
        <button className="home-btn relapse" onClick={handleRelapse}>
          Relapse (Reset streak)
        </button>
      </div>
      {showPopup && (
        <CheckinPopup
          onClose={() => setShowPopup(false)}
          streak={streak}
          status={popupStatus}
        />
      )}
    </div>
  );
}

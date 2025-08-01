import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(120, 200, 120, 0.22); /* light green */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 8000;
`;

const Popup = styled.div`
  background: #f6fff6; /* very light green */
  border-radius: 16px;
  padding: 36px 28px 24px 28px;
  min-width: 340px;
  box-shadow: 0 6px 36px rgba(90,180,90,0.18);
  text-align: center;
  border: 2.5px solid #a8e6a1;
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
  position: relative;
`;

const VeggieIcon = styled.div`
  font-size: 44px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  background: linear-gradient(90deg, #b6e2b6 0%, #6fdc6f 100%);
  color: #225522;
  border: none;
  border-radius: 8px;
  padding: 11px 22px;
  margin: 0 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s;
  box-shadow: 0 2px 8px rgba(100,200,100,0.10);
  &:hover {
    background: linear-gradient(90deg, #6fdc6f 0%, #b6e2b6 100%);
  }
`;

const milestoneDays = [7, 14, 30, 60, 100];

export default function CheckinPopup({ onClose, streak, status }) {
  const navigate = useNavigate();

  // If not logged in (streak null or missing currentStreak)
  const notLoggedIn = !streak || typeof streak.currentStreak !== "number";

  // Always show login warning if not logged in
  if (notLoggedIn) {
    return (
      <Overlay>
        <Popup>
          <VeggieIcon>🔒</VeggieIcon>
          <h2 style={{ color: "#e67e22" }}>You need to log in!</h2>
          <div style={{ margin: "16px 0", color: "#336633" }}>
            Please log in to use the check-in and streak management features.
          </div>
          <Button onClick={onClose}>Back to Home</Button>
        </Popup>
      </Overlay>
    );
  }

  const { currentStreak, bestStreak, relapseCount } = streak;

  const isMilestone = milestoneDays.includes(currentStreak);

  let milestoneStatus = null;
  if (status === "success" && isMilestone) {
    if (bestStreak === currentStreak) {
      milestoneStatus = "new";
    } else if (bestStreak > currentStreak) {
      milestoneStatus = "already";
    }
  }

  // ====== State for warning popup ======
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  function handleJournalClick() {
    if (status !== "success" && status !== "already" && status !== "relapse") {
      setWarningMessage("You need to check in before writing a Journal!");
      setShowWarning(true);
    } else {
      navigate("/journal");
    }
  }

  function handleWarningClose() {
    setShowWarning(false);
    setWarningMessage("");
  }

  // ====== If relapse and not logged in, still show login warning ======
  if (status === "relapse" && notLoggedIn) {
    return (
      <Overlay>
        <Popup>
          <VeggieIcon>🔒</VeggieIcon>
          <h2 style={{ color: "#e67e22" }}>You need to log in!</h2>
          <div style={{ margin: "16px 0", color: "#336633" }}>
            Please log in to use this feature.
          </div>
          <Button onClick={() => navigate("/login")}>Log In</Button>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </Popup>
      </Overlay>
    );
  }

  // ====== Show warning popup if needed ======
  if (showWarning) {
    return (
      <Overlay>
        <Popup>
          <VeggieIcon>⚠️</VeggieIcon>
          <h2 style={{ color: "#e67e22" }}>Attention</h2>
          <div style={{ margin: "16px 0", color: "#336633" }}>
            {warningMessage}
          </div>
          <Button onClick={handleWarningClose}>Got it</Button>
        </Popup>
      </Overlay>
    );
  }

  // If just reached a new milestone
  if (milestoneStatus === "new") {
    return (
      <Overlay>
        <Popup>
          <VeggieIcon>🥦🥕</VeggieIcon>
          <h2 style={{color: "#339933"}}>🎉 Congratulations on reaching {currentStreak} days!</h2>
          <div style={{ margin: "16px 0", color: "#336633" }}>
            Current streak: <b>{currentStreak}</b><br />
            Best streak: <b>{bestStreak}</b><br />
            Relapses: <b>{relapseCount}</b>
          </div>
          <Button onClick={() => navigate("/milestones")}>
            View Milestones
          </Button>
          <Button onClick={onClose}>
            Close
          </Button>
        </Popup>
      </Overlay>
    );
  }

  // If milestone but already received
  if (milestoneStatus === "already") {
    return (
      <Overlay>
        <Popup>
          <VeggieIcon>🥬</VeggieIcon>
          <h2 style={{color: "#339933"}}>You've already received this {currentStreak}-day milestone!</h2>
          <div style={{ margin: "16px 0", color: "#336633" }}>
            Current streak: <b>{currentStreak}</b><br />
            Best streak: <b>{bestStreak}</b><br />
            Relapses: <b>{relapseCount}</b>
          </div>
          <Button onClick={() => navigate("/milestones")}>
            View Milestones
          </Button>
          <Button onClick={onClose}>
            Close
          </Button>
        </Popup>
      </Overlay>
    );
  }

  // If relapse
  if (status === "relapse") {
    return (
      <Overlay>
        <Popup>
          <VeggieIcon>🥑</VeggieIcon>
          <h2 style={{ color: "#e67e22" }}>Your streak has been reset!</h2>
          <div style={{ margin: "16px 0", color: "#336633" }}>
            Current streak: <b>{currentStreak}</b><br />
            Best streak: <b>{bestStreak}</b><br />
            Relapses: <b>{relapseCount}</b>
          </div>
          <Button onClick={onClose}>
            Close
          </Button>
        </Popup>
      </Overlay>
    );
  }

  // Not a new milestone
  return (
    <Overlay>
      <Popup>
        <VeggieIcon>🥑</VeggieIcon>
        {status === "already" ? (
          <h2 style={{color: "#339933"}}>You have already checked in today!</h2>
        ) : status === "success" ? (
          <h2 style={{color: "#339933"}}>Check-in successful!</h2>
        ) : (
          <div style={{color: "#336633"}}>Checking in...</div>
        )}
        <div style={{ margin: "16px 0", color: "#336633" }}>
          Current streak: <b>{currentStreak}</b><br />
          Best streak: <b>{bestStreak}</b><br />
          Relapses: <b>{relapseCount}</b>
        </div>
        <Button onClick={handleJournalClick}>
          Write Journal
        </Button>
        <Button onClick={onClose}>
          Close
        </Button>
      </Popup>
    </Overlay>
  );
}

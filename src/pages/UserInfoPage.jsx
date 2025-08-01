import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../helpers/UserApi"; // Sử dụng API mới
import "../../css/Profile.css";

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [milestones, setMilestones] = useState([]);
  const [bestStreak, setBestStreak] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [relapseCount, setRelapseCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // Reset state to default when user changes
      setMilestones([]);
      setBestStreak(0);
      setCurrentStreak(0);
      setRelapseCount(0);

      if (user) {
        const profileRes = await getProfile();
        if (profileRes) {
          setMilestones(profileRes.milestones || []);
          setBestStreak(profileRes.bestStreak || 0);
          setCurrentStreak(profileRes.currentStreak || 0);
          setRelapseCount(profileRes.relapseCount || 0);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [user]);

  if (!user)
    return (
      <div className="profile-container">
        <p className="empty">You are not logged in.</p>
      </div>
    );

  return (
    <div className="profile-container">
      <h2>Profile Information</h2>
      <p><b>Name:</b> {user.username}</p>
      <p><b>ID:</b> {user._id}</p>

      {loading ? (
        <p className="loading">Loading streak information...</p>
      ) : (
        <>
          <p><b>Current streak:</b> {currentStreak}</p>
          <p><b>Best streak:</b> {bestStreak}</p>
          <p><b>Relapses:</b> {relapseCount}</p>
          <div>
            <b>Achieved milestones:</b>
            {milestones.length === 0 ? (
              <span className="empty"> No milestones achieved yet.</span>
            ) : (
              <ul>
                {milestones.map((m, idx) => (
                  <li key={m.days || idx}>
                    <b>{m.days} days</b>
                    {m.note && <span> - {m.note}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

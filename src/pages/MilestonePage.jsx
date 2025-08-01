import React, { useEffect, useState } from 'react';
import { getMilestones, checkAndSaveMilestone } from '../helpers/MilestoneApi';
import { useAuth } from "../context/AuthContext";
import "../../css/MilestonesPage.css"; 

export default function MilestonesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [milestones, setMilestones] = useState([]);
  const [notAchieved, setNotAchieved] = useState([]);
  const [bestStreak, setBestStreak] = useState(0);

  useEffect(() => {
      if (!user) {
        setLoading(false); // hoặc set về trạng thái ban đầu
        return; // Không gọi API nếu chưa login
      }
    async function fetchData() {
      setLoading(true);
      setMilestones([]);
      setNotAchieved([]);
      setBestStreak(0);

      await checkAndSaveMilestone({ streak: bestStreak });

      const res = await getMilestones();
      if (res) {
        setMilestones(res.achieved || []);
        setNotAchieved(res.notAchieved || []);
        setBestStreak(res.bestStreak || 0);
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
    <div className="milestones-container">
      <h1 className="milestones-title">Your Milestones</h1>
      <p className="milestones-beststreak">Best streak: <b>{bestStreak}</b> days</p>

      {loading ? <p className="milestones-loading">Loading...</p> : (
        <>
          <h2 className="milestones-section-title">🎉 Achieved</h2>
          {milestones.length === 0 ? (
            <p className="milestones-empty">You haven't achieved any milestones yet.</p>
          ) : (
            <ul className="milestones-list">
              {milestones.map(m => (
                <li key={m.days} className="milestone-achieved">
                  <span className="milestone-days">{m.days} days</span>
                  {m.note && <div className="milestone-note">{m.note}</div>}
                </li>
              ))}
            </ul>
          )}

          <h2 className="milestones-section-title">⏳ Not Achieved</h2>
          {notAchieved.length === 0 ? (
            <p className="milestones-empty">You have achieved all milestones!</p>
          ) : (
            <ul className="milestones-list milestones-list-notachieved">
              {notAchieved.map(day => (
                <li key={day} className="milestone-notachieved">
                  <span>{day} days</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

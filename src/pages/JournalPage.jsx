import React, { useEffect, useState } from "react";
import * as journalApi from "../helpers/JournalApi";
import { useAuth } from "../context/AuthContext";
import "../../css/Journal.css";

export default function Notes() {
  const { user } = useAuth();
  const [journals, setJournals] = useState([]);
  const [note, setNote] = useState("");
  const [mood, setMood] = useState("neutral");
  const [alert, setAlert] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState("");
  const [editMood, setEditMood] = useState("neutral");

  // Fetch all journals for this user
  const fetchJournals = async () => {
    if (!user) {
      setJournals([]);
      return;
    }
    const res = await journalApi.getJournals();
    setJournals(res || []);
  };

  // When user changes (login/logout), reset state and fetch journals again
  useEffect(() => {
    setJournals([]);
    setNote("");
    setMood("neutral");
    setEditingId(null);
    setEditNote("");
    setEditMood("neutral");
    if (user) fetchJournals();
    // eslint-disable-next-line
  }, [user]);

  // Alert auto-hide after 2s
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleAdd = async () => {
    if (!note.trim()) return;
    const today = new Date().toISOString().slice(0, 10);
    await journalApi.createJournal({
      note,
      mood,
      date: today,
    });
    setNote("");
    setMood("neutral");
    setAlert("Journal added successfully!");
    fetchJournals();
  };

  const handleDelete = async (id) => {
    await journalApi.deleteJournal(id);
    setAlert("Journal deleted!");
    fetchJournals();
  };

  const handleEdit = (j) => {
    setEditingId(j._id || j.id);
    setEditNote(j.note);
    setEditMood(j.mood || "neutral");
  };

  const handleUpdate = async (id) => {
    await journalApi.updateJournal(id, {
      note: editNote,
      mood: editMood,
      date: new Date().toISOString().slice(0, 10),
    });
    setAlert("Journal updated!");
    setEditingId(null);
    setEditNote("");
    setEditMood("neutral");
    fetchJournals();
  };

  return (
    <div className="notes-wrapper">
      <h2 className="notes-title">Today's Journal</h2>
      {alert && <div className="notes-alert">{alert}</div>}
      {!user ? (
        <div className="profile-container">
          <p className="empty">You are not logged in.</p>
        </div>
      ) : (
        <>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Today's journal..."
            rows={4}
            className="notes-textarea"
          />
          <div style={{ marginBottom: 8 }}>
            <label>
              Mood:&nbsp;
              <select
                value={mood}
                onChange={e => setMood(e.target.value)}
                className="notes-mood-select"
              >
                <option value="happy">Happy</option>
                <option value="neutral">Neutral</option>
                <option value="sad">Sad</option>
                <option value="angry">Angry</option>
                <option value="excited">Excited</option>
              </select>
            </label>
          </div>
          <button onClick={handleAdd} className="notes-add-btn">Add journal</button>
        </>
      )}

      <ul className="notes-list">
        {journals.map(j => (
          <li key={j._id || j.id} className="notes-item">
            {editingId === (j._id || j.id) ? (
              <>
                <textarea
                  value={editNote}
                  onChange={e => setEditNote(e.target.value)}
                  rows={2}
                  className="notes-edit-textarea"
                />
                <select
                  value={editMood}
                  onChange={e => setEditMood(e.target.value)}
                  className="notes-edit-mood-select"
                >
                  <option value="happy">Happy</option>
                  <option value="neutral">Neutral</option>
                  <option value="sad">Sad</option>
                  <option value="angry">Angry</option>
                  <option value="excited">Excited</option>
                </select>
                <button onClick={() => handleUpdate(j._id || j.id)} className="notes-action-btn">Save</button>
                <button onClick={() => setEditingId(null)} className="notes-action-btn">Cancel</button>
              </>
            ) : (
              <>
                <span className="notes-date">{new Date(j.date).toISOString().slice(0, 10)}</span>: {j.note}
                {j.mood && (
                  <span className="notes-mood">
                    ({j.mood})
                  </span>
                )}
                <button className="notes-action-btn" onClick={() => handleEdit(j)}>Edit</button>
                <button className="notes-danger-btn" onClick={() => handleDelete(j._id || j.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

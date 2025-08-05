import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as checklistApi from "../helpers/ChecklistApi";
import '../../css/CheckList.css'; 

const CATEGORY_OPTIONS = [
'Eat clean',
 'Do excercise',
 'Study'
];

export default function ChecklistPage() {
  const { user } = useAuth();
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDate, setNewDate] = useState("");
  const [newCategory, setNewCategory] = useState(CATEGORY_OPTIONS[0]);
  const [newItems, setNewItems] = useState([{ text: "", checked: false }]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null); // id of checklist being edited
  const [editItems, setEditItems] = useState([]);
  const [editDate, setEditDate] = useState("");
  const [editCategory, setEditCategory] = useState(CATEGORY_OPTIONS[0]);

  // Fetch checklists when user logs in
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    checklistApi
      .getChecklists()
      .then((data) => {
        setChecklists(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  // Add a new item row
  const handleAddItem = () => {
    setNewItems([...newItems, { text: "", checked: false }]);
  };

  // Remove an item row
  const handleRemoveItem = (idx) => {
    setNewItems(newItems.filter((_, i) => i !== idx));
  };

  // Edit item content
  const handleItemChange = (idx, field, value) => {
    setNewItems(
      newItems.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      )
    );
  };

  // Create a new checklist
  const handleCreateChecklist = async (e) => {
    e.preventDefault();
    setError("");
    if (!newDate) {
      setError("Please select a date for the checklist.");
      return;
    }
    if (newItems.length === 0 || newItems.some((item) => !item.text.trim())) {
      setError("Please enter at least one task.");
      return;
    }
    const data = {
      date: newDate,
      category: newCategory,
      items: newItems,
    };
    const res = await checklistApi.createChecklist(data);
    if (res && res._id) {
      setChecklists([res, ...checklists]);
      setNewDate("");
      setNewCategory(CATEGORY_OPTIONS[0]);
      setNewItems([{ text: "", checked: false }]);
    } else {
      setError("Could not create checklist, please try again.");
    }
  };

  // Delete checklist
  const handleDeleteChecklist = async (id) => {
    if (!window.confirm("Are you sure you want to delete this checklist?")) return;
    const res = await checklistApi.deleteChecklist(id);
    if (res && res.message) {
      setChecklists(checklists.filter((c) => c._id !== id));
    } else {
      alert("Delete failed!");
    }
  };

  // Start editing checklist
  const handleEditChecklist = (cl) => {
    setEditingId(cl._id);
    setEditItems(cl.items.map(item => ({ ...item })));
    setEditDate(cl.date.slice(0, 10));
    setEditCategory(cl.category || CATEGORY_OPTIONS[0]);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditItems([]);
    setEditDate("");
    setEditCategory(CATEGORY_OPTIONS[0]);
  };

  // Edit item content in edit mode
  const handleEditItemChange = (idx, field, value) => {
    setEditItems(
      editItems.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      )
    );
  };

  // Add item in edit mode
  const handleAddEditItem = () => {
    setEditItems([...editItems, { text: "", checked: false }]);
  };

  // Remove item in edit mode
  const handleRemoveEditItem = (idx) => {
    setEditItems(editItems.filter((_, i) => i !== idx));
  };

  // Save edited checklist
  const handleSaveEdit = async () => {
    if (!editDate) {
      alert("Please select a date for the checklist.");
      return;
    }
    if (editItems.length === 0 || editItems.some((item) => !item.text.trim())) {
      alert("Please enter at least one task.");
      return;
    }
    const data = {
      date: editDate,
      category: editCategory,
      items: editItems,
    };
    const res = await checklistApi.updateChecklist(editingId, data);
    if (res && res._id) {
      setChecklists(
        checklists.map((cl) => (cl._id === editingId ? res : cl))
      );
      handleCancelEdit();
    } else {
      alert("Update failed!");
    }
  };

  // Toggle checked in edit mode
  const handleToggleEditChecked = (idx) => {
    setEditItems(
      editItems.map((item, i) =>
        i === idx ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Toggle checked in view mode
  const handleToggleChecked = async (clId, idx) => {
    const cl = checklists.find(c => c._id === clId);
    if (!cl) return;
    const newItems = cl.items.map((item, i) =>
      i === idx ? { ...item, checked: !item.checked } : item
    );
    // Call API to update
    const res = await checklistApi.updateChecklist(clId, { date: cl.date, category: cl.category, items: newItems });
    if (res && res._id) {
      setChecklists(
        checklists.map((c) => (c._id === clId ? res : c))
      );
    }
  };

  if (!user)
    return (
      <div className="profile-container">
        <p className="empty">You are not logged in.</p>
      </div>
    );

  return (
    <div className="checklist-page-wrapper">
      <h2 style={{ color: "#339933" }}>Daily Checklist 🥬</h2>

      {/* New checklist form */}
      <form onSubmit={handleCreateChecklist} className="checklist-section">
        <div className="checklist-section-title">Create new checklist</div>
        <div className="checklist-form-row" style={{ marginBottom: 8 }}>
          <label>
            Date:{" "}
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              required
              className="checklist-input"
              style={{ maxWidth: 180 }}
            />
          </label>
        </div>
        <div className="checklist-form-row" style={{ marginBottom: 8 }}>
          <label>
            Category:{" "}
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              className="checklist-input"
              style={{ maxWidth: 180 }}
              required
            >
              {CATEGORY_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
        <div>
          {newItems.map((item, idx) => (
            <div key={idx} className="checklist-form-row">
              <input
                type="text"
                placeholder="Enter a task..."
                value={item.text}
                onChange={(e) =>
                  handleItemChange(idx, "text", e.target.value)
                }
                className="checklist-input"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(idx)}
                disabled={newItems.length === 1}
                className="checklist-danger-btn"
                style={{ marginRight: 4 }}
                title="Delete this task"
              >
                X
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddItem} className="checklist-add-btn">
            + Add task
          </button>
        </div>
        {error && <div className="checklist-error">{error}</div>}
        <button type="submit" className="checklist-add-btn" style={{ marginTop: 12 }}>
          Create checklist
        </button>
      </form>

      {/* Checklist list */}
      <div className="checklist-section">
        <div className="checklist-section-title">Your checklist list</div>
        {loading ? (
          <div>Loading...</div>
        ) : checklists.length === 0 ? (
          <div>No checklist yet.</div>
        ) : (
          checklists.map((cl) =>
            editingId === cl._id ? (
              // Edit mode
              <div
                key={cl._id}
                className="checklist-card"
                style={{
                  border: "2px solid #007bff",
                  background: "#f5faff"
                }}
              >
                <div className="checklist-form-row" style={{ marginBottom: 8 }}>
                  <label>
                    Date:{" "}
                    <input
                      type="date"
                      value={editDate}
                      onChange={e => setEditDate(e.target.value)}
                      className="checklist-input"
                      style={{ maxWidth: 180 }}
                    />
                  </label>
                </div>
                <div className="checklist-form-row" style={{ marginBottom: 8 }}>
                  <label>
                    Category:{" "}
                    <select
                      value={editCategory}
                      onChange={e => setEditCategory(e.target.value)}
                      className="checklist-input"
                      style={{ maxWidth: 180 }}
                      required
                    >
                      {CATEGORY_OPTIONS.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <ul className="checklist-list">
                  {editItems.map((item, idx) => (
                    <li key={item._id || idx} className="checklist-item">
                      <input
                        type="text"
                        value={item.text}
                        onChange={e => handleEditItemChange(idx, "text", e.target.value)}
                        className="checklist-input"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveEditItem(idx)}
                        disabled={editItems.length === 1}
                        className="checklist-danger-btn"
                        style={{ marginRight: 4 }}
                        title="Delete this task"
                      >
                        X
                      </button>
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={handleAddEditItem} className="checklist-add-btn">
                  + Add task
                </button>
                <div style={{ marginTop: 8 }}>
                  <button type="button" onClick={handleSaveEdit} className="checklist-action-btn" style={{ marginRight: 8 }}>
                    Save
                  </button>
                  <button type="button" onClick={handleCancelEdit} className="checklist-action-btn">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View mode
              <div
                key={cl._id}
                className="checklist-card"
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <strong className="checklist-title">{new Date(cl.date).toLocaleDateString("en-GB")}</strong>
                    <span style={{ marginLeft: 10, color: "#888", fontSize: 14 }}>
                      [{cl.category}]
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => handleEditChecklist(cl)}
                      className="checklist-action-btn"
                      style={{ marginRight: 8 }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteChecklist(cl._id)}
                      className="checklist-danger-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <ul className="checklist-list">
                  {cl.items.map((item, idx) => (
                    <li
                      key={item._id || idx}
                      className={`checklist-item${item.checked ? " checked" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleToggleChecked(cl._id, idx)}
                      />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
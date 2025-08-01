import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

const Overlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(120, 200, 120, 0.22);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
`;

const Popup = styled.div`
  background: #f6fff6;
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
  font-size: 42px;
  margin-bottom: 12px;
`;

const TabButton = styled.button`
  background: ${props => props.$active ? "#b6e2b6" : "#eaffea"};
  color: ${props => props.$active ? "#24723c" : "#336633"};
  border: none;
  border-bottom: ${props => props.$active ? "2.5px solid #5cb85c" : "2.5px solid transparent"};
  padding: 10px 24px;
  font-size: 1.07rem;
  font-weight: 500;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  margin: 0 4px;
  transition: background 0.2s;
  &:disabled { opacity: 0.7; cursor: default; }
`;

const Input = styled.input`
  display: block;
  margin-bottom: 14px;
  width: 100%;
  padding: 8px 2px;
  border: 1.3px solid #bde5a8;
  border-radius: 7px;
  font-size: 1.08rem;
  outline: none;
  background: #f9fff8;
  transition: border 0.18s;
  &:focus { border: 1.8px solid #6fdc6f; }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px 0;
  background: linear-gradient(90deg, #b6e2b6 0%, #6fdc6f 100%);
  color: #225522;
  border: none;
  border-radius: 8px;
  font-size: 1.14rem;
  font-weight: 600;
  margin-top: 6px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(100,200,100,0.10);
  transition: background 0.18s, color 0.18s;
  &:hover { background: linear-gradient(90deg, #6fdc6f 0%, #b6e2b6 100%); color: #155724; }
`;

const CloseButton = styled.button`
  background: none;
  color: #6fbf73;
  border: none;
  font-size: 1.07rem;
  padding: 4px 12px;
  border-radius: 6px;
  cursor: pointer;
  &:hover { background: #eaffea; color: #225522; }
`;

export default function AuthPopup({ onClose }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  // Reset form mỗi khi chuyển tab
  useEffect(() => {
    setUsername("");
    setPassword("");
    setMsg("");
  }, [tab]);

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    if (tab === "login") {
      const ok = await login(username, password);
      if (!ok) setMsg("Incorrect username or password!");
      else onClose();
    } else {
      const ok = await register(username, password);
      if (!ok) {
        setMsg("Username already exists or server error!");
      } else {
        setMsg("Register successful! Please login.");
        setTab("login");
      }
    }
  };

  return (
    <Overlay>
      <Popup>
        <VeggieIcon>🥬🥑</VeggieIcon>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <TabButton $active={tab==="login"} onClick={() => setTab("login")} disabled={tab==="login"}>Login</TabButton>
          <TabButton $active={tab==="register"} onClick={() => setTab("register")} disabled={tab==="register"}>Register</TabButton>
        </div>
        <form onSubmit={handleSubmit}>
          <Input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            required
            autoFocus
          />
          <Input
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <SubmitButton type="submit">
            {tab === "login" ? "Login" : "Register"}
          </SubmitButton>
        </form>
        {msg && (
          <div
            style={{
              color: msg.includes("success") ? "#27ae60" : "#e74c3c",
              marginTop: 8,
              fontWeight: 500
            }}
          >
            {msg}
          </div>
        )}
        <div style={{ marginTop: 12, textAlign: "right" }}>
          <CloseButton onClick={onClose}>Close</CloseButton>
        </div>
      </Popup>
    </Overlay>
  );
}

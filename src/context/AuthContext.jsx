import React, { createContext, useState, useContext, useEffect } from "react";
import * as userApi from "../helpers/UserApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      userApi.getProfile().then(profile => {
        if (profile) {
          setUser(profile);
        } else {
          setUser(null);
        }
      });
    }
  }, []);

  const login = async (username, password) => {
    const res = await userApi.loginUser({ username, password });
    if (res && res.token) {
      localStorage.setItem("token", res.token);
      setUser(res.user);
      return true;
    }
    return false;
  };

  const register = async (username, password) => {
    const res = await userApi.registerUser({ username, password });
    if (res && res.user) {
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

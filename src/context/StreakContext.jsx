import React, { createContext, useContext, useState, useEffect } from "react";
import { getStreak, increaseStreak as apiIncreaseStreak, relapseStreak as apiRelapseStreak } from "../helpers/StreakApi";
import { useAuth } from "../context/AuthContext";

const StreakContext = createContext();

export function StreakProvider({ children }) {
  const { user } = useAuth(); 
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStreak = async () => {
      setLoading(true);
      try {
        const data = await getStreak();
        setStreak(Array.isArray(data) && data.length > 0 ? data[0] : data);
        setError(null);
      } catch (err) {
        setError("Fetch streak failed");
        setStreak(null);
      }
      setLoading(false);
    };
    if (user) fetchStreak();
    else setStreak(null); // clear streak khi logout
  }, [user]);

  // Hàm tăng streak (hoặc tạo mới nếu chưa có)
  const increaseStreak = async () => {
    setLoading(true);
    try {
      const res = await apiIncreaseStreak();
      // Sau khi tăng thì fetch lại streak để đồng bộ
      const data = await getStreak();
      setStreak(Array.isArray(data) && data.length > 0 ? data[0] : data);
      setError(null);
      setLoading(false);
      return res;
    } catch (err) {
      setError("Increase streak failed");
      setLoading(false);
      throw err;
    }
  };

  const resetStreak = async () => {
    setLoading(true);
    try {
      const res = await apiRelapseStreak();
      // Sau khi reset thì fetch lại streak để đồng bộ
      const data = await getStreak();
      setStreak(Array.isArray(data) && data.length > 0 ? data[0] : data);
      setError(null);
      setLoading(false);
      return res;
    } catch (err) {
      setError("Reset streak failed");
      setLoading(false);
      throw err;
    }
  };

  return (
  <StreakContext.Provider value={{ streak, increaseStreak, resetStreak, loading, error }}>
    {children}
  </StreakContext.Provider>
  );
}

export function useStreak() {
  return useContext(StreakContext);
}

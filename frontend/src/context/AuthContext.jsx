import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchAuthStatus = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/me", {
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data);
      console.log("✅ Logged in as:", data.username);
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

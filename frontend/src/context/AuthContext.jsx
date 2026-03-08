import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch {}

      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

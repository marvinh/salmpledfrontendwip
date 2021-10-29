import React, { useEffect, useState } from "react";
import { auth } from "../services/firebase";
export const AuthContext = React.createContext();

//3.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user)
      setLoading(false)

    });
    return unsubscribe;
  }, []);

  return (
      <AuthContext.Provider value={{ user, loading }}>{ children}</AuthContext.Provider>
  );
};
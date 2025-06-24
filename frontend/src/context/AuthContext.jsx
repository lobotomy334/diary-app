import { createContext, useContext, useState, useEffect } from "react";
import { getToken, saveToken, removeToken } from "../utils/tokenService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const saved = getToken();
    if (saved) {
      setToken(saved);
      setUsername(localStorage.getItem("username"));
    }
  }, []);

  const login = (newToken, newUsername) => {
    saveToken(newToken);
    localStorage.setItem("username", newUsername);
    setToken(newToken);
    setUsername(newUsername);
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem("username");
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
"use client";
import axios from "axios";
import { createContext, useCallback, useContext, useState } from "react";

const AuthContext = createContext();
const baseUrl = "http://localhost:3001/api";

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (data) => {
    try {
      const response = await axios.post(`${baseUrl}/users/login`, data, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setIsAuthenticated(true);
        return response;
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        status: error.response?.status || 500,
        data: { message: error.message },
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    // Ici, vous pouvez ajouter une requête au serveur pour déconnecter l'utilisateur si nécessaire
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}/users/me`, {
        withCredentials: true,
      });
      setIsAuthenticated(response.status === 200);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

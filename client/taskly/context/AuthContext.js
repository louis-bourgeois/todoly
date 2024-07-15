"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();
const baseUrl = "http://localhost:3001/api";

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const login = useCallback(async (data) => {
    try {
      const response = await axios.post(`${baseUrl}/users/login`, data, {
        withCredentials: true,
      });
      console.log("response status", response.status);
      if (response.status === 200) {
        setIsAuthenticated(true);
        setLoading(false);
        return response;
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsAuthenticated(false);
      setLoading(false);
      return {
        status: error.response?.status || 500,
        data: { message: error.message },
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post(
        `${baseUrl}/users/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
      router.push("/auth/login");
    }
  }, [router]);

  const checkAuth = useCallback(async () => {
    console.trace("checkAuth Called");
    try {
      const response = await axios.get(`${baseUrl}/users/me`, {
        withCredentials: true,
      });
      console.log(
        "response status state of check auth",
        response.status === 200
      );
      setIsAuthenticated(response.status === 200);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

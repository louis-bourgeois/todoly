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

import { useDemoMode } from "./DemoModeContext";
import { useError } from "./ErrorContext";
// const baseUrl = `/api`;
const baseUrl= "/api"
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { isDemoMode } = useDemoMode();
  const { handleError } = useError();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const login = useCallback(async (data) => {
    try {
      const response = await axios.post(`${baseUrl}/users/login`, data, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setIsAuthenticated(true);
        setLoading(false);
        return response;
      }
    } catch (error) {
      handleError(error);
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
      await axios.post(`${baseUrl}/users/logout`, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
      router.push("/");
    }
  }, [router]);

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

  useEffect(() => {
    if (isDemoMode) {
      setIsAuthenticated(true);
      setLoading(false);
      return;
    }
    checkAuth();
  }, [checkAuth, isDemoMode]);

  if (isDemoMode) {
    return (
      <AuthContext.Provider
        value={{
          isAuthenticated: true,
          loading: false,
          authChecked: true,
          login: async () => ({ status: 200, data: { demo: true } }),
          logout: async () => {
            router.push("/");
          },
          checkAuth: async () => true,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        authChecked: !loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

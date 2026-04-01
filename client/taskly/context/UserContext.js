"use client";
import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { useDemoData } from "./DemoDataContext";
import { useDemoMode } from "./DemoModeContext";
import { useError } from "./ErrorContext";

const UserContext = createContext();
const baseUrl = "/api/users";

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { isDemoMode } = useDemoMode();
  const demoData = useDemoData();
  const [user, setUser] = useState(null);
  const { isAuthenticated } = useAuth();
  const { handleError } = useError();

  const fetchUser = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await axios.get(`${baseUrl}/me`, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      handleError(error);
    }
  }, [isAuthenticated]);

  const deleteUser = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await axios.delete(`${baseUrl}`);
    } catch (error) {
      handleError(error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isDemoMode) return;
    fetchUser();
  }, [fetchUser, isDemoMode]);

  if (isDemoMode && demoData) {
    return (
      <UserContext.Provider
        value={{
          user: demoData.user,
          setUser: demoData.setUser,
          fetchUser: async () => demoData.user,
          deleteUser: async () => null,
        }}
      >
        {children}
      </UserContext.Provider>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

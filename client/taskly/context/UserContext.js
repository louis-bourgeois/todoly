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

const UserContext = createContext();
const baseUrl = "/api";

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchUser = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await axios.get(`${baseUrl}/users/me`, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data.user) {
        setUser(response.data.user);
      }
      console.log(response.data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

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
import { useError } from "./ErrorContext";

const UserContext = createContext();
const baseUrl = "/api/users";

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
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
      console.log(response.data.user);
    } catch (error) {
      handleError(error);
    }
  }, [isAuthenticated]);

  const deleteUser = useCallback(async () => {
    console.log();
    if (!isAuthenticated) return;
    try {
      const response = await axios.delete(`${baseUrl}`);
      console.log(response.data.message);

      return response.data.message;
    } catch (error) {
      handleError(error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

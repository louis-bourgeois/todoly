"use client";
import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "./AuthContext";

const UserPreferencesContext = createContext();
const baseUrl = "http://localhost:3001/api";

export const useUserPreferences = () => useContext(UserPreferencesContext);

export const UserPreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({});
  const { isAuthenticated } = useAuth();
  const preferencesLoaded = useRef(false);

  function transformPreferences(preferencesArray) {
    return preferencesArray.reduce((acc, pref) => {
      acc[pref.preference_key] = pref.preference_value;
      return acc;
    }, {});
  }

  const fetchPreferences = useCallback(async () => {
    console.log("fetch");
    if (!isAuthenticated || preferencesLoaded.current) return;

    try {
      const response = await axios.get(`${baseUrl}/preferences`, {
        withCredentials: true,
      });
      setPreferences(transformPreferences(response.data.preferences));
      preferencesLoaded.current = true;
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  }, [isAuthenticated, setPreferences]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  useEffect(() => {
    console.log("====================================");
    console.log("update preferences", preferences);
    console.log("====================================");
  }, [preferences]);

  const addUserPreference = async (data) => {
    try {
      const { key, value } = data;
      await axios.post(
        `${baseUrl}/preferences/`,
        { key, value },
        { withCredentials: true }
      );
      setPreferences((prev) => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error("Failed to add user preference:", error);
    }
  };

  const updateUserPreference = async (newData) => {
    console.trace("update");
    try {
      const { key, value } = newData;
      const response = await axios.post(
        `${baseUrl}/preferences/update`,
        { key, value },
        { withCredentials: true }
      );

      setPreferences((prev) => ({
        ...prev,
        [key]: value,
      }));
    } catch (error) {
      console.error("Failed to update user preference:", error);
    }
  };

  const getUserPreferences = async (keys = "*") => {
    console.log("get");
    try {
      const response = await axios.get(
        `${baseUrl}/preferences/`,
        { params: { keys } },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get user preferences:", error);
      return null;
    }
  };

  const contextValue = useMemo(
    () => ({
      updateUserPreference,
      addUserPreference,
      getUserPreferences,
      preferences,
      setPreferences,
    }),
    [preferences]
  );

  return (
    <UserPreferencesContext.Provider value={contextValue}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

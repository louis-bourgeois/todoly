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
import { config } from "../config";
import { useAuth } from "./AuthContext";

const UserPreferencesContext = createContext();
const baseUrl = `${config.apiUrl}/api`;

export const useUserPreferences = () => useContext(UserPreferencesContext);

export const UserPreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, checkAuth } = useAuth();
  const preferencesLoaded = useRef(false);

  function transformPreferences(preferencesArray) {
    return preferencesArray.reduce((acc, pref) => {
      acc[pref.preference_key] = pref.preference_value;
      return acc;
    }, {});
  }

  const fetchPreferences = useCallback(async () => {
    if (!isAuthenticated || preferencesLoaded.current) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/preferences`, {
        withCredentials: true,
      });
      setPreferences(transformPreferences(response.data.preferences));
      preferencesLoaded.current = true;
    } catch (error) {
      console.error("Error fetching preferences:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const addUserPreference = async (data) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (newData) => {
    setLoading(true);
    try {
      const { key, value } = newData;
      await axios.post(
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
    } finally {
      setLoading(false);
    }
  };

  const getUserPreferences = async (keys = "*") => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/preferences/`,
        { params: { keys } },
        { withCredentials: true }
      );
      setLoading(false);
      return response.data;
    } catch (error) {
      console.error("Failed to get user preferences:", error);
      setLoading(false);
      return null;
    }
  };

  const contextValue = useMemo(
    () => ({
      updatePreference,
      addUserPreference,
      getUserPreferences,
      preferences,
      setPreferences,
      loading,
    }),
    [preferences, loading]
  );

  return (
    <UserPreferencesContext.Provider value={contextValue}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

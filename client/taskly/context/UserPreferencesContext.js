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
import { useDemoData } from "./DemoDataContext";
import { useDemoMode } from "./DemoModeContext";

const UserPreferencesContext = createContext();
const baseUrl = "/api/preferences";

export const useUserPreferences = () => useContext(UserPreferencesContext);

export const UserPreferencesProvider = ({ children }) => {
  const { isDemoMode } = useDemoMode();
  const demoData = useDemoData();
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
      const response = await axios.get(`${baseUrl}`, {
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
    if (isDemoMode) return;
    fetchPreferences();
  }, [fetchPreferences, isDemoMode]);

  if (isDemoMode && demoData) {
    return (
      <UserPreferencesContext.Provider
        value={{
          updatePreference: demoData.updatePreference,
          addUserPreference: demoData.addUserPreference,
          getUserPreferences: demoData.getUserPreferences,
          preferences: demoData.preferences,
          setPreferences: demoData.setPreferences,
          loading: false,
        }}
      >
        {children}
      </UserPreferencesContext.Provider>
    );
  }

  const addUserPreference = async (data) => {
    setLoading(true);
    try {
      const { key, value } = data;
      await axios.post(`${baseUrl}`, { key, value }, { withCredentials: true });
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
      console.log(key, value);
      await axios.post(
        `${baseUrl}/update`,
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
        `${baseUrl}`,
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

"use client";
import axios from "axios";
import { createContext, useContext } from "react";
import { useUser } from "./UserContext";

const UserPreferencesContext = createContext();
const baseUrl = "http://localhost:3001/api";

export const useUserPreferences = () => useContext(UserPreferencesContext);

export const UserPreferencesProvider = ({ children }) => {
  const { setPreferences } = useUser();
  const addUserPreference = async (data) => {
    try {
      const { key, value } = data;
      await axios.post(
        `${baseUrl}/preferences/`,
        { key, value },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Failed to add user preference:", error);
    }
  };

  const updateUserPreference = async (newData) => {
    console.trace();
    try {
      const { key, value } = newData;
      const response = await axios.post(
        `${baseUrl}/preferences/update`,
        { key, value },
        { withCredentials: true }
      );

      setPreferences(() => {
        return response.data.reduce((acc, curr) => {
          acc[curr.preference_key] = curr.preference_value;
          return acc || [];
        }, {});
      });
    } catch (error) {
      console.error("Failed to update user preference:", error);
    }
  };

  const getUserPreferences = async (keys = "*") => {
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

  return (
    <UserPreferencesContext.Provider
      value={{ updateUserPreference, addUserPreference, getUserPreferences }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

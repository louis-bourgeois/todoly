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

const TagContext = createContext();
const baseUrl = "/api/tags";

export const useTag = () => useContext(TagContext);

export const TagProvider = ({ children }) => {
  const { isDemoMode } = useDemoMode();
  const demoData = useDemoData();
  const [tags, setTags] = useState([]);
  const { isAuthenticated, checkAuth } = useAuth();

  const fetchTags = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await axios.get(`${baseUrl}`, {
        withCredentials: true,
      });
      setTags(response.data.tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isDemoMode) return;
    fetchTags();
  }, [fetchTags, isDemoMode]);

  const addTag = useCallback(async (name) => {
    try {
      const response = await axios.post(
        `${baseUrl}/add`,
        { name },
        { withCredentials: true }
      );
      if (response.status === 200 && response.data.tags) {
        setTags(response.data.tags);

        return response.data.tags;
      }
    } catch (error) {
      console.error("Error adding tag:", error);
      throw error;
    }
  }, []);

  const updateTag = useCallback(async (name, id) => {
    try {
      const response = await axios.post(
        `${baseUrl}/update`,
        { newName: name, id },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setTags(response.data.tags);
      }
    } catch (error) {
      console.error("Error updating tag:", error);
      throw error;
    }
  }, []);

  const deleteTag = useCallback(async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/delete/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
      throw error;
    }
  }, []);

  const contextValue =
    isDemoMode && demoData
      ? {
          tags: demoData.tags,
          addTag: demoData.addTag,
          updateTag: demoData.updateTag,
          deleteTag: demoData.deleteTag,
        }
      : { tags, addTag, updateTag, deleteTag };

  return <TagContext.Provider value={contextValue}>{children}</TagContext.Provider>;
};

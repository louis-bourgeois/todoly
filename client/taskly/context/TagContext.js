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

const TagContext = createContext();
const baseUrl = "http://localhost:3001/api";

export const useTag = () => useContext(TagContext);

export const TagProvider = ({ children }) => {
  const [tags, setTags] = useState([]);
  const { isAuthenticated, checkAuth } = useAuth();

  const fetchTags = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await axios.get(`${baseUrl}/tags`, {
        withCredentials: true,
      });
      setTags(response.data.tags);
      console.log(response.data.tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const addTag = useCallback(async (name) => {
    console.log(name);
    try {
      const response = await axios.post(
        `${baseUrl}/tags/add`,
        { name },
        { withCredentials: true }
      );
      console.log(response.data, response.status);
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
        `${baseUrl}/tags/update`,
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
      const response = await axios.delete(`${baseUrl}/tags/delete/${id}`, {
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

  return (
    <TagContext.Provider value={{ tags, addTag, updateTag, deleteTag }}>
      {children}
    </TagContext.Provider>
  );
};

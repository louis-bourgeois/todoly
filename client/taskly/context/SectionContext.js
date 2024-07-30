"use client";
import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { config } from "../config";
import { useAuth } from "./AuthContext";

export const SectionContext = createContext();
const baseUrl = `${config.apiUrl}/api`;

export const useSection = () => useContext(SectionContext);

export const SectionProvider = ({ children }) => {
  const [sections, setSections] = useState([]);
  const { isAuthenticated, checkAuth } = useAuth();

  const fetchSections = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await axios.get(`${baseUrl}/sections`, {
        withCredentials: true,
      });

      setSections(response.data.sections);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  }, [isAuthenticated, setSections]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const addSection = useCallback(async (section) => {
    try {
      const response = await axios.post(
        `${baseUrl}/sections/add`,
        { section },
        { withCredentials: true }
      );
      if (response.status === 200 && response.data.sections) {
        setSections(response.data.sections);
      }
    } catch (error) {
      console.error("Error adding section:", error);
      throw error;
    }
  }, []);

  const modifySection = useCallback(async (newName, sectionId) => {
    try {
      const response = await axios.post(
        `${baseUrl}/sections/update`,
        { newName, sectionId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setSections(response.data.user_sections);
      }
    } catch (error) {
      console.error("Error modifying section:", error);
      throw error;
    }
  }, []);

  const deleteSection = useCallback(async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/sections/delete/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setSections((prev) =>
          prev.filter(
            (section) => section.id !== id || section.name === "Other"
          )
        );
      }
    } catch (error) {
      console.error("Error deleting section:", error);
      throw error;
    }
  }, []);

  return (
    <SectionContext.Provider
      value={{
        sections,
        addSection,
        modifySection,
        deleteSection,
        setSections,
      }}
    >
      {children}
    </SectionContext.Provider>
  );
};

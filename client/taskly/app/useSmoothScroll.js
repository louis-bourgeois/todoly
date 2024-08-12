import { useCallback } from "react";

const useSmoothScroll = () => {
  const scrollToSection = useCallback((sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return scrollToSection;
};

export default useSmoothScroll;

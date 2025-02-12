import { useEffect, useRef } from "react";

const MobileTextContent = ({ children }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    const currentContent = contentRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeIn");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (currentContent) {
      observer.observe(currentContent);
    }

    return () => {
      if (currentContent) {
        observer.unobserve(currentContent);
      }
    };
  }, []);

  return (
    <div
      ref={contentRef}
      className="opacity-0 transition-opacity duration-1000"
    >
      {children}
    </div>
  );
};

export default MobileTextContent;

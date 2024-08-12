import { useEffect, useRef, useState } from "react";

const MobileTextContent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      if (contentRef.current) {
        observer.unobserve(contentRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={contentRef}
      className={`px-6 py-12 transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <h2 className="text-2xl font-bold text-text mb-4">
        An intuitive and easy way to interact with your projects.
      </h2>
      <p className="text-lg text-text">
        A workspace based approach that allows you to switch quickly between
        different projects.
      </p>
    </div>
  );
};

export default MobileTextContent;

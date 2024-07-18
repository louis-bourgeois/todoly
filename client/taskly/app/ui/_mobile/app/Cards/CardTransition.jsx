import { useEffect, useRef, useState } from "react";

const CardTransition = ({ cardType, children, className }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [content, setContent] = useState(children);
  const prevCardTypeRef = useRef(cardType);

  useEffect(() => {
    if (prevCardTypeRef.current !== cardType) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setContent(children);
        setIsVisible(true);
      }, 300);

      prevCardTypeRef.current = cardType;
      return () => clearTimeout(timer);
    } else {
      setContent(children);
    }
  }, [cardType, children]);

  return (
    <div
      className={`transition-all duration-500 ease-[cubic-bezier(1,0,0,1)] ${className}`}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {content}
    </div>
  );
};

export default CardTransition;

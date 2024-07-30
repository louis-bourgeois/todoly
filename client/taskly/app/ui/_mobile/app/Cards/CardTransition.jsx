import { useEffect, useRef, useState } from "react";

const CardTransition = ({ cardType, children, className, isTransitioning }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [content, setContent] = useState(children);
  const prevCardTypeRef = useRef(cardType);
  const transitionTimerRef = useRef(null);

  useEffect(() => {
    console.log(`CardTransition: cardType=${cardType}, isVisible=${isVisible}`);
  }, [cardType, isVisible]);

  useEffect(() => {
    if (prevCardTypeRef.current !== cardType) {
      setIsVisible(false);

      // Clear any existing timer
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }

      transitionTimerRef.current = setTimeout(() => {
        setContent(children);
        setIsVisible(true);
        transitionTimerRef.current = null;
      }, 300);

      prevCardTypeRef.current = cardType;
    } else {
      setContent(children);
      setIsVisible(true);
    }

    // Cleanup function
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
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

import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

const ButtonContent = memo(({ label, isDropdown, isOpen }) => (
  <span
    className={`flex items-center justify-center capitalize 2xs:text-1.5xs xs:text-sm`}
  >
    {label}
    {isDropdown && (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="11"
        height="6"
        viewBox="0 0 11 6"
        fill="none"
        className={`ml-2 transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
        aria-hidden="true"
      >
        <path
          d="M6.24178 5.71588L10.6897 1.64326C10.788 1.55396 10.8661 1.44773 10.9193 1.33068C10.9726 1.21363 11 1.08809 11 0.961285C11 0.834485 10.9726 0.708939 10.9193 0.59189C10.8661 0.474841 10.788 0.368606 10.6897 0.279313C10.4931 0.100415 10.2273 -3.37772e-08 9.95013 -4.58914e-08C9.67299 -5.80056e-08 9.40711 0.100415 9.21056 0.279313L5.49697 3.67957L1.78338 0.279313C1.58683 0.100414 1.32095 -4.23085e-07 1.04381 -4.35199e-07C0.766667 -4.47313e-07 0.500787 0.100414 0.304236 0.279313C0.20701 0.369064 0.130091 0.475506 0.0778856 0.592534C0.0256805 0.709561 -0.000781096 0.834874 1.71241e-05 0.961285C-0.000781107 1.0877 0.0256805 1.21301 0.0778856 1.33004C0.130091 1.44706 0.20701 1.55351 0.304236 1.64326L4.75215 5.71588C4.84967 5.80591 4.9657 5.87736 5.09353 5.92613C5.22137 5.97489 5.35848 6 5.49697 6C5.63545 6 5.77257 5.97489 5.9004 5.92613C6.02824 5.87736 6.14426 5.80591 6.24178 5.71588Z"
          fill="currentColor"
        />
      </svg>
    )}
  </span>
));

const DropdownContent = memo(
  ({ options, onOptionClick, isOpen, buttonRect, maxVisibleOptions = 5 }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
      if (isOpen && buttonRect && dropdownRef.current) {
        const updatePosition = () => {
          const { bottom, left, width } = buttonRect;
          const { innerHeight, innerWidth } = window;
          const dropdownRect = dropdownRef.current.getBoundingClientRect();

          let top = bottom;
          let leftPos = left;

          // Check if dropdown would go off-screen vertically
          if (top + dropdownRect.height > innerHeight) {
            // Position above the button if it would go off-screen
            top = bottom - dropdownRect.height - buttonRect.height;
          }

          // Check if dropdown would go off-screen horizontally
          if (left + dropdownRect.width > innerWidth) {
            leftPos = innerWidth - dropdownRect.width;
          }

          dropdownRef.current.style.top = `${top}px`;
          dropdownRef.current.style.left = `${leftPos}px`;
          dropdownRef.current.style.width = `${width}px`;
        };

        updatePosition();
        window.addEventListener("scroll", updatePosition);
        window.addEventListener("resize", updatePosition);

        return () => {
          window.removeEventListener("scroll", updatePosition);
          window.removeEventListener("resize", updatePosition);
        };
      }
    }, [isOpen, buttonRect]);

    if (!buttonRect) return null;

    return createPortal(
      <div
        ref={dropdownRef}
        className="z-50 bg-white rounded-md shadow-lg overflow-auto transition-all duration-300 ease-in-out fixed"
        style={{
          maxHeight: `${maxVisibleOptions * 37}px`,
          opacity: isOpen ? 1 : 0,
          transform: `scale(${isOpen ? 1 : 0.95})`,
          visibility: isOpen ? "visible" : "hidden",
        }}
      >
        {options.map((option, index) => (
          <button
            key={index}
            className="relative block w-full text-left px-4 py-2 text-xs text-gray-700 overflow-hidden"
            onClick={() => onOptionClick(option)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span className="relative z-10">{option}</span>
            <span
              className="absolute inset-0 bg-dominant rounded-md transition-all duration-300 ease-in-out"
              style={{
                opacity: hoveredIndex === index ? 0.1 : 0,
                transform: `scale(${hoveredIndex === index ? 1 : 0.95})`,
              }}
            />
          </button>
        ))}
      </div>,
      document.body
    );
  }
);

const Button = forwardRef(
  (
    {
      label,
      dominant = false,
      light = false,
      className = "",
      options = [],
      onOptionClick,
      onClick,
      maxVisibleOptions = 5,
      setState = null,
      disabled = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [buttonRect, setButtonRect] = useState(null);
    const buttonRef = useRef(null);
    const isDropdown = options.length > 0;

    const handleClick = useCallback(() => {
      if (isDropdown) {
        setIsOpen((prev) => !prev);
        if (setState) {
          setState((prev) => !prev);
        }
        if (buttonRef.current) {
          setButtonRect(buttonRef.current.getBoundingClientRect());
        }
      } else if (onClick) {
        onClick();
      }
    }, [isDropdown, onClick, setState]);

    const handleOptionClick = useCallback(
      (option) => {
        if (onOptionClick) {
          onOptionClick(option);
        }
        setIsOpen(false);
      },
      [onOptionClick]
    );

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (buttonRef.current && !buttonRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      const handleScroll = () => {
        if (buttonRef.current && isOpen) {
          setButtonRect(buttonRef.current.getBoundingClientRect());
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleScroll);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      };
    }, [isOpen]);

    const buttonClasses = `
      ${dominant ? "bg-dominant text-white" : "bg-black text-white"}
      ${light ? "font-light" : "font-normal"}
      px-4 py-2 rounded-full
      transition-all duration-300 ease-in-out
      hover:scale-105 active:scale-95 focus:outline-none 
      ${dominant ? "focus:ring-dominant " : "focus:ring-black"}
      text-xs
      ${className}
    `.trim();

    return (
      <>
        <button
          ref={buttonRef}
          disabled={disabled}
          onClick={handleClick}
          className={buttonClasses}
          aria-haspopup={isDropdown}
          aria-expanded={isDropdown ? isOpen : undefined}
        >
          <ButtonContent
            label={label}
            isDropdown={isDropdown}
            isOpen={isOpen}
          />
        </button>
        {isDropdown && (
          <DropdownContent
            options={options}
            onOptionClick={handleOptionClick}
            isOpen={isOpen}
            buttonRect={buttonRect}
            maxVisibleOptions={maxVisibleOptions}
          />
        )}
      </>
    );
  }
);

Button.displayName = "Button";

export default Button;

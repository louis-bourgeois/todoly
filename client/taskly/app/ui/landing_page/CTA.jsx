"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const TRANSITION_DURATION = 150;
const ICON_WIDTH = 25;

const useHover = () => {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  return [
    isHovered,
    { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave },
  ];
};

const Wrapper = React.memo(
  React.forwardRef(
    ({ children, className, style, onClick, disabled, ...props }, ref) => (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={`inline-flex items-center justify-center ${className}`}
        style={style}
        {...props}
      >
        {children}
      </button>
    )
  )
);
Wrapper.displayName = "Wrapper";

const IconSvg = React.memo(({ className = "", fill }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={ICON_WIDTH}
    height={ICON_WIDTH * 0.794}
    viewBox="0 0 34 27"
    fill="none"
    className={`transition-all duration-150 ease-in-out ${className}`}
  >
    <path
      d="M9.04526 19.0036C9.64703 18.2363 10.2278 17.4863 10.8186 16.7442C14.8099 11.7317 19.2529 7.19591 24.6715 3.70099C27.1281 2.11656 29.7333 0.842855 32.5727 0.0914798C33.3715 -0.119914 33.9377 0.258188 33.9079 0.954946C33.8933 1.29734 33.6741 1.50643 33.4256 1.68852C29.464 4.59179 25.8339 7.86958 22.4099 11.385C19.7341 14.1321 17.2709 17.0604 14.9025 20.0714C13.3348 22.0644 11.7804 24.068 10.2133 26.0616C9.89937 26.461 9.4561 26.6624 9.03491 26.6303"
      fill={fill}
    />
    <path
      d="M9.03496 26.6303C8.96903 26.6253 8.87729 26.6127 8.77345 26.5787C8.77345 26.5787 8.51811 26.5013 8.30517 26.2849C4.98711 22.9121 2.22103 19.1693 0.642912 14.6498C0.341467 13.7865 0.17667 12.891 0.0983648 11.9796C0.0628985 11.5669 0.144617 11.1957 0.512318 10.9586C0.868192 10.7291 1.23148 10.7975 1.58089 10.9998C3.11081 11.8853 4.34798 13.1074 5.50673 14.4184C6.85116 15.9396 7.93167 17.5045 8.91931 18.8337C9.00017 18.9426 9.0406 18.997 9.04531 19.0036C9.95251 20.2748 10.3902 22.5025 9.03496 26.6303Z"
      fill="#007AFF"
    />
  </svg>
));
IconSvg.displayName = "IconSvg";

const CTA = React.memo(
  React.forwardRef(
    (
      {
        type = "primary",
        title,
        className = "",
        showIcons = true,
        onClick,
        disabled = false,
        "aria-label": ariaLabel,
      },
      ref
    ) => {
      const [isHovered, hoverProps] = useHover();
      const [displayIcons, setDisplayIcons] = useState(false);
      const contentRef = useRef(null);

      const ctaStyle = useMemo(() => {
        switch (type) {
          case "primary":
            return "shadow-shadow_card bg-Ternary font-bold text-text rounded-[33.489px]";
          case "secondary":
            return `py-[8px] px-[32px] text-base font-bold border border-dominant text-dominant hover:bg-dominant hover:text-text transition-colors duration-300
                ${
                  isHovered ? "bg-dominant text-text" : ""
                }  rounded-[33.489px]`;
          case "ghost":
            return `text-text hover:text-blue-500 transition-colors duration-150
                ${isHovered ? "text-blue-500" : ""}`;
          default:
            return "";
        }
      }, [type, isHovered]);

      useEffect(() => {
        setDisplayIcons(isHovered && showIcons && type === "primary");
      }, [isHovered, showIcons, type]);
      useEffect(() => {
        if (ref?.current && contentRef?.current) {
          ref.current.style.width = `${contentRef.current.offsetWidth}px`;
        }
      }, [displayIcons, title, ref]);

      const iconStyle = useMemo(
        () => ({
          width: displayIcons ? `${ICON_WIDTH}px` : "0px",
          overflow: "hidden",
          transition: `all ${TRANSITION_DURATION}ms ease-in-out`,
          opacity: displayIcons ? 1 : 0,
          marginLeft: displayIcons ? "0.5rem" : "0",
          marginRight: displayIcons ? "0.5rem" : "0",
        }),
        [displayIcons]
      );

      return (
        <Wrapper
          ref={ref}
          disabled={disabled}
          onClick={onClick}
          className={`${ctaStyle} ${className} cursor-pointer overflow-hidden transition-all duration-150 ease-in-out`}
          {...hoverProps}
          aria-label={ariaLabel || title}
        >
          <div
            ref={contentRef}
            className="flex items-center justify-center whitespace-nowrap"
          >
            {type === "primary" && showIcons && (
              <div style={iconStyle}>
                <IconSvg fill={"black"} />
              </div>
            )}
            <span>{title}</span>
            {type === "primary" && showIcons && (
              <div style={iconStyle}>
                <IconSvg fill={"black"} />
              </div>
            )}
          </div>
        </Wrapper>
      );
    }
  )
);

CTA.displayName = "CTA";

export default CTA;

import { useEffect, useState } from "react";
import { useMenu } from "../../../../../../../context/MenuContext";
import { useUserPreferences } from "../../../../../../../context/UserPreferencesContext";

export default function MobileMainButtons() {
  const { cardType, setCardType } = useMenu();
  const { updatePreference, preferences } = useUserPreferences();
  const [lastUrlSegment, setLastUrlSegment] = useState("");

  useEffect(() => {
    function getLastUrlSegment(path) {
      const segments = path.split("/");
      return segments[segments.length - 1] || "home";
    }

    function updateLastUrlSegment() {
      if (typeof window !== "undefined") {
        const newLastSegment = getLastUrlSegment(window.location.pathname);
        setLastUrlSegment(newLastSegment);
      }
    }

    // Initial update
    updateLastUrlSegment();

    // Listen for popstate events (back/forward navigation)
    window.addEventListener("popstate", updateLastUrlSegment);

    // Create a MutationObserver to watch for changes in the DOM
    // This can help catch programmatic navigation that doesn't trigger popstate
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          updateLastUrlSegment();
        }
      });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup
    return () => {
      window.removeEventListener("popstate", updateLastUrlSegment);
      observer.disconnect();
    };
  }, []);

  const capitalize = (s) =>
    s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  const handleClick = () => {
    const newCardType =
      cardType === "Add" || cardType === "Task" || cardType === "Workspace"
        ? capitalize(lastUrlSegment)
        : "Add";
    setCardType(newCardType);
  };
  return (
    <div
      className={`z-[190] flex items-center justify-center shadow-shadow_01 pr-[2%] rounded-full h-[50px] bg-primary`}
    >
      <style jsx>{`
        .smooth-rotate {
          transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
      <div
        className="relative w-[50px] h-[47px] cursor-pointer z-[194]"
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="47"
          viewBox="0 0 50 47"
          fill="none"
          className={`absolute top-0 left-0 smooth-rotate ${
            cardType === "Add" ||
            cardType === "Task" ||
            cardType === "Workspace"
              ? "rotate-45"
              : "rotate-0"
          }`}
        >
          <path
            d="M24.9999 6.63531C21.4194 6.63531 17.9193 7.65684 14.9422 9.57072C11.9651 11.4846 9.64474 14.2049 8.27454 17.3875C6.90433 20.5702 6.54582 24.0723 7.24435 27.451C7.94287 30.8297 9.66706 33.9332 12.1989 36.3691C14.7307 38.805 17.9564 40.4639 21.4681 41.1359C24.9799 41.808 28.6199 41.4631 31.9278 40.1448C35.2358 38.8265 38.0632 36.594 40.0524 33.7297C42.0416 30.8654 43.1034 27.4978 43.1034 24.053C43.1034 21.7656 42.6351 19.5007 41.7253 17.3875C40.8156 15.2743 39.4821 13.3542 37.801 11.7368C36.1199 10.1194 34.1242 8.83647 31.9278 7.96115C29.7314 7.08584 27.3773 6.63531 24.9999 6.63531ZM24.9999 37.9871C22.1355 37.9871 19.3354 37.1699 16.9537 35.6387C14.5721 34.1076 12.7158 31.9314 11.6196 29.3853C10.5235 26.8392 10.2366 24.0375 10.7955 21.3345C11.3543 18.6316 12.7336 16.1488 14.7591 14.2001C16.7845 12.2513 19.3651 10.9242 22.1745 10.3866C24.9839 9.84893 27.8959 10.1249 30.5422 11.1795C33.1886 12.2342 35.4505 14.0201 37.0419 16.3116C38.6333 18.603 39.4827 21.2971 39.4827 24.053C39.4827 27.7485 37.9568 31.2927 35.2408 33.9059C32.5247 36.519 28.841 37.9871 24.9999 37.9871ZM32.2413 22.3112H26.8103V17.0859C26.8103 16.624 26.6195 16.1809 26.28 15.8543C25.9405 15.5276 25.4801 15.3441 24.9999 15.3441C24.5198 15.3441 24.0593 15.5276 23.7198 15.8543C23.3803 16.1809 23.1896 16.624 23.1896 17.0859V22.3112H17.7586C17.2784 22.3112 16.818 22.4947 16.4785 22.8213C16.1389 23.148 15.9482 23.591 15.9482 24.053C15.9482 24.5149 16.1389 24.9579 16.4785 25.2846C16.818 25.6112 17.2784 25.7947 17.7586 25.7947H23.1896V31.02C23.1896 31.482 23.3803 31.925 23.7198 32.2516C24.0593 32.5783 24.5198 32.7618 24.9999 32.7618C25.4801 32.7618 25.9405 32.5783 26.28 32.2516C26.6195 31.925 26.8103 31.482 26.8103 31.02V25.7947H32.2413C32.7214 25.7947 33.1819 25.6112 33.5214 25.2846C33.8609 24.9579 34.0517 24.5149 34.0517 24.053C34.0517 23.591 33.8609 23.148 33.5214 22.8213C33.1819 22.4947 32.7214 22.3112 32.2413 22.3112Z"
            fill="#007AFF"
          />
        </svg>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        className="text-text"
        onClick={async () => {
          if (preferences?.Color_Theme) {
            const newTheme =
              preferences.Color_Theme.toLowerCase() === "#ffffff"
                ? "#000000"
                : "#ffffff";
            await updatePreference({ key: "Color_Theme", value: newTheme });
          }
        }}
      >
        <path
          d="M4.24992 16.9788C4.17234 20.6561 5.55556 24.2142 8.09651 26.8736C10.6375 29.533 14.129 31.0768 17.806 31.1667C20.2309 31.1396 22.6038 30.4598 24.6751 29.1987C26.7465 27.9375 28.4398 26.1416 29.5771 23.9998C29.6989 23.7767 29.7585 23.5249 29.7496 23.2709C29.7407 23.0169 29.6636 22.7699 29.5264 22.556C29.3892 22.342 29.197 22.1689 28.9699 22.0547C28.7427 21.9406 28.4891 21.8897 28.2355 21.9074L28.0797 21.9187C27.8941 21.9329 27.7071 21.947 27.513 21.947C24.5874 21.8574 21.8164 20.6122 19.8067 18.4841C17.7971 16.3561 16.7124 13.5184 16.7903 10.5924C16.79 8.61308 17.2848 6.66509 18.2296 4.92577C18.3513 4.70292 18.4108 4.45145 18.402 4.19769C18.3932 3.94392 18.3164 3.69719 18.1795 3.48331C18.0427 3.26942 17.8509 3.09625 17.6242 2.98191C17.3975 2.86756 17.1442 2.81626 16.8908 2.83335C13.3895 3.16542 10.1424 4.80678 7.79882 7.42929C5.45524 10.0518 4.18782 13.4622 4.24992 16.9788ZM14.6525 6.13844C14.1946 7.57877 13.9614 9.08107 13.9612 10.5924C13.9053 13.9534 15.0596 17.2224 17.2135 19.803C19.3674 22.3837 22.3773 24.104 25.694 24.65C24.7198 25.7932 23.5113 26.7137 22.1504 27.3492C20.7895 27.9847 19.3079 28.3203 17.806 28.3334C14.8804 28.2437 12.1094 26.9985 10.0997 24.8705C8.09008 22.7424 7.00544 19.9048 7.08325 16.9788C7.05015 14.6067 7.76301 12.2841 9.12118 10.339C10.4793 8.39387 12.4142 6.92454 14.6525 6.13844Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

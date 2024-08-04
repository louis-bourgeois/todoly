import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMenu } from "../../../../context/MenuContext";
import { useUserPreferences } from "../../../../context/UserPreferencesContext";
import Button from "../app/Cards/assets/Button";

const SORT_BY_OPTIONS = ["Creation date", "Tags", "Importance", "Last updated"];
const SHOW_OPTIONS = ["All tasks", "Completed only", "Todo only"];

const MobileViewsMenu = ({ isVisible }) => {
  const { preferences, updatePreference } = useUserPreferences();
  const { setIsMobileViewsMenuOpen } = useMenu();
  const [isSortByOpen, setIsSortByOpen] = useState(false);
  const [isShowOpen, setIsShowOpen] = useState(false);
  const menuRef = useRef(null);
  const contentRef = useRef(null);
  const firstFocusableElement = useRef(null);
  const lastFocusableElement = useRef(null);

  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "";

    if (isVisible) {
      firstFocusableElement.current?.focus();
    } else {
      setIsSortByOpen(false);
      setIsShowOpen(false);
    }
  }, [isVisible]);

  const handleClose = useCallback(() => {
    setIsMobileViewsMenuOpen(false);
    setIsSortByOpen(false);
    setIsShowOpen(false);
  }, [setIsMobileViewsMenuOpen]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains("mobile-views-menu-overlay")) {
        handleClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isVisible) {
        handleClose();
      }
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement.current) {
            e.preventDefault();
            lastFocusableElement.current?.focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement.current) {
            e.preventDefault();
            firstFocusableElement.current?.focus();
          }
        }
      }
    };

    if (isVisible) {
      document.addEventListener("click", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose, isVisible]);

  const handleOptionClick = useCallback(
    async (preferenceName, option) => {
      await updatePreference({ key: preferenceName, value: option });
      if (preferenceName === "Sort_By") {
        setIsSortByOpen(false);
      } else if (preferenceName === "Show") {
        setIsShowOpen(false);
      }
    },
    [updatePreference]
  );

  const renderDropdown = (
    title,
    preferenceName,
    options,
    isOpen,
    setIsOpen
  ) => (
    <div className="flex justify-between items-center mb-4">
      <h4 id={`${preferenceName}-label`} className="text-m font-bold">
        {title}
      </h4>
      <Button
        label={preferences[preferenceName]}
        options={options}
        onOptionClick={(option) => {
          if (isOpen) {
            handleOptionClick(preferenceName, option);
          }
        }}
        setState={setIsOpen}
        className="bg-secondary text-primary rounded-full py-1 px-2.5 text-xs"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${preferenceName}-label`}
        ref={
          preferenceName === "Sort_By"
            ? firstFocusableElement
            : lastFocusableElement
        }
      />
    </div>
  );

  useEffect(() => {
    if (menuRef.current && contentRef.current) {
      const updateHeight = () => {
        const viewportHeight = window.innerHeight;
        const contentHeight = contentRef.current.scrollHeight;
        const maxHeight = Math.min(contentHeight, viewportHeight * 0.9);
        menuRef.current.style.height = `${maxHeight}px`;
      };

      updateHeight();
      window.addEventListener("resize", updateHeight);

      return () => {
        window.removeEventListener("resize", updateHeight);
      };
    }
  }, [isSortByOpen, isShowOpen]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-views-menu-title"
      className={`fixed inset-0 bg-secondary transition-opacity duration-300 ease-in-out z-50 mobile-views-menu-overlay ${
        isVisible ? "bg-opacity-50" : "bg-opacity-0 pointer-events-none"
      } ${isVisible ? "visible" : "invisible"}`}
    >
      <div
        ref={menuRef}
        className={`p-8 py-2.5 fixed bottom-0 left-0 right-0 bg-primary rounded-t-3xl shadow-shadow_01 transform transition-all duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "translate-y-full"
        } overflow-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={contentRef} className="menu-content flex flex-col">
          <h3
            id="mobile-views-menu-title"
            className="text-2xl font-bold w-full text-center mb-4"
          >
            Filter
          </h3>
          <div className="flex flex-col items-between w-full flex-grow">
            {renderDropdown(
              "Sort By",
              "Sort_By",
              SORT_BY_OPTIONS,
              isSortByOpen,
              setIsSortByOpen
            )}
            {renderDropdown(
              "Show",
              "Show",
              SHOW_OPTIONS,
              isShowOpen,
              setIsShowOpen
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MobileViewsMenu);

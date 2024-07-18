import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMenu } from "../../../../context/MenuContext";
import { useUserPreferences } from "../../../../context/UserPreferencesContext";
import Button from "../app/Cards/assets/Button";

const MobileViewsMenu = ({ isVisible }) => {
  const [isRendered, setIsRendered] = useState(false);
  const { preferences, updateUserPreference } = useUserPreferences();
  const { setIsMobileViewsMenuOpen } = useMenu();
  const [openDropdown, setOpenDropdown] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      setIsRendered(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      const timer = setTimeout(() => {
        setIsRendered(false);
        setOpenDropdown(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleClose = useCallback(() => {
    setIsMobileViewsMenuOpen(false);
    setOpenDropdown(null);
  }, [setIsMobileViewsMenuOpen]);

  const handleOutsideClick = useCallback(
    (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        handleClose();
      }
    },
    [handleClose]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  const handleDropdownToggle = useCallback(
    (dropdownName) => (isOpen) => {
      setOpenDropdown(isOpen ? dropdownName : null);
    },
    []
  );

  const handleOptionClick = useCallback(
    async (preferenceName, option) => {
      await updateUserPreference({ key: preferenceName, value: option });
      setOpenDropdown(null);
    },
    [updateUserPreference]
  );

  const getMarginBottom = (dropdownName) => {
    if (openDropdown === dropdownName) {
      return "mb-32";
    }
    return "mb-0";
  };

  const sortByOptions = ["Creation date", "Tags", "Importance", "Last updated"];
  const showOptions = ["All tasks", "Completed only", "Todo only"];

  return (
    <div
      className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-50 ${
        isVisible ? "bg-opacity-50" : "bg-opacity-0 pointer-events-none"
      } ${isRendered ? "visible" : "invisible"}`}
    >
      <div
        ref={menuRef}
        className={`p-8 py-2.5 fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-shadow_01 transform transition-all duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "translate-y-full"
        } flex flex-col justify-start items-between overflow-hidden`}
      >
        <div className="menu-content">
          <h3 className="text-2xl font-bold w-full text-center mb-4">Filter</h3>
          <div className="flex flex-col items-between w-full gap-[10px]">
            <div
              className={`flex justify-between items-center ${getMarginBottom(
                "sortBy"
              )}`}
            >
              <h4 className="text-m font-bold">Sort By</h4>
              <Button
                label={preferences.Sort_By}
                options={sortByOptions}
                onOptionClick={(option) => handleOptionClick("Sort_By", option)}
                onClick={handleDropdownToggle("sortBy")}
                isOpen={openDropdown === "sortBy"}
                className="bg-black text-white rounded-full py-1 px-2.5 text-xs"
              />
            </div>
            <div
              className={`flex justify-between items-center ${getMarginBottom(
                "show"
              )}`}
            >
              <h4 className="text-m font-bold">Show</h4>
              <Button
                label={preferences.Show}
                options={showOptions}
                onOptionClick={(option) => handleOptionClick("Show", option)}
                onClick={handleDropdownToggle("show")}
                isOpen={openDropdown === "show"}
                className="bg-black text-white rounded-full py-1 px-2.5 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MobileViewsMenu);

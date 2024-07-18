import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Blur from "ui/app/Blur";
import NavButton from "ui/app/NavButton";
import { useMenu } from "../../../context/MenuContext";
import { useUser } from "../../../context/UserContext";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import MainMenu from "./MainMenu/MainMenu";

const TITLES = {
  evening: "Good Evening,",
  night: "Good Night,",
  morning: "Good Morning,",
  afternoon: "Good Afternoon,",
  meal: "Bon Appétit,",
};

export default function Navbar() {
  const { user, loading } = useUser();
  const { preferences } = useUserPreferences();
  const { toggleTaskMenu, toggleSearchMenu } = useMenu();

  const [showMenu, setShowMenu] = useState(false);
  const [showContentMenu, setShowContentMenu] = useState(false);
  const [marginTop, setMarginTop] = useState(0);
  const [height, setHeight] = useState(0);
  const [profilePictureVisibility, setProfilePictureVisibility] =
    useState(true);

  const elementRef = useRef(null);
  const containerRef = useRef(null);

  const name = useMemo(() => user?.first_name || "guest", [user?.first_name]);

  const title = useMemo(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 23 || currentHour < 6) return TITLES.night;
    if (currentHour >= 6 && currentHour < 12) return TITLES.morning;
    if (currentHour === 12) return TITLES.meal;
    if (currentHour > 12 && currentHour < 18) return TITLES.afternoon;
    return TITLES.evening;
  }, []);

  const updateDimensions = useCallback(() => {
    if (showMenu && elementRef.current) {
      const scale = 0.8;
      const rect = elementRef.current.getBoundingClientRect();
      const adjustedHeight = rect.height * scale;
      const adjustedTop = rect.top + (rect.height - adjustedHeight) / 2;
      setHeight(adjustedHeight);
      setMarginTop(adjustedTop);
    }
  }, [showMenu]);
  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  useEffect(() => {
    let timer;
    if (showMenu) {
      timer = setTimeout(() => setShowContentMenu(true), 500);
    } else {
      setShowContentMenu(false);
    }
    return () => clearTimeout(timer);
  }, [showMenu]);

  const handlePPclick = useCallback(() => {
    setShowMenu((prev) => !prev);
    setProfilePictureVisibility(true);
  }, []);

  const handleTaskMenuClick = useCallback(() => {
    toggleTaskMenu("", "", "Task");
  }, [toggleTaskMenu]);

  if (loading) return null;

  return (
    <>
      <MainMenu
        containerRef={containerRef}
        showMenu={showMenu}
        showContentMenu={showContentMenu}
        marginTop={marginTop}
        height={height}
        name={name}
        setProfilePictureVisibility={setProfilePictureVisibility}
        profilePictureVisibility={profilePictureVisibility}
      />
      <ul className="flex items-center justify-between mt-[clamp(1vh,2vh,3vh)] text-[clamp(0.25rem,1vw+0.1rem,4rem)]">
        <li className="grow-0 max-w-[7.0%] z-20 h-full p-[0_clamp(1rem,0.675cqi,9rem)]">
          <div
            className={`flex items-start justify-center ${
              profilePictureVisibility
                ? "opacity-100 cursor-pointer"
                : "opacity-0"
            }`}
            onClick={profilePictureVisibility ? handlePPclick : undefined}
          >
            <Image
              ref={elementRef}
              src={`${user ? "/user/photo_profil_google.jpeg" : ""}`}
              alt="Profile Picture"
              width={150}
              height={150}
              priority
              quality={100}
              className={`rounded-full transition-all duration-300 max-w-full ease ${
                showMenu ? "scale-[0.8]" : ""
              } ${profilePictureVisibility ? "opacity-100" : "opacity-0"}`}
              onLoad={updateDimensions}
            />
          </div>
        </li>
        <li>
          <h1 className="text-5xl font-black">
            {preferences.Home_Page_Title ===
            "Depending on the time of day + name" ? (
              <>
                {title} <span className="text-dominant">{name}</span>
              </>
            ) : (
              preferences.Home_Page_Title
            )}
          </h1>
        </li>
        <li className="flex max-w-[17.5%] gap-iconsContainer items-center justify-center h-full mr-[0.5vw]">
          <NavButton
            styles="border border-dominant rounded-full shadow-2xl"
            onClick={toggleSearchMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="grow-0 shrink-0 w-full p-[20%]"
              aria-label="Search"
            >
              <path d="M3.624,15a8.03,8.03,0,0,0,10.619.659l5.318,5.318a1,1,0,0,0,1.414-1.414l-5.318-5.318A8.04,8.04,0,0,0,3.624,3.624,8.042,8.042,0,0,0,3.624,15Zm1.414-9.96a6.043,6.043,0,1,1-1.77,4.274A6,6,0,0,1,5.038,5.038Z" />
            </svg>
          </NavButton>
          <NavButton
            flexShrinkGrow
            styles="w-1/2"
            onClick={handleTaskMenuClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="flex justify-center items-center text-dominant"
              aria-label="Add"
              fill="currentColor"
            >
              <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8 A8,8,0,0,1,12,20Zm4-9H13V8a1,1,0,0,0-2,0v3H8a1,1,0,0,0,0,2h3v3a1,1,0,0,0,2,0V13h3a1,1,0,0,0,0-2Z" />
            </svg>
          </NavButton>
        </li>
      </ul>
      <Blur
        trigger={handlePPclick}
        show={showMenu}
        showZ="10"
        hideZ="0"
        bg="bg-transparent"
        fullscreen={true}
      />
    </>
  );
}

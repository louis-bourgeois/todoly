import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import Blur from "ui/app/Blur";
import NavButton from "ui/app/NavButton";
import { MenuContext } from "../../../context/MenuContext";
import { useUser } from "../../../context/UserContext";
import MainMenu from "./MainMenu/MainMenu";
export default function Navbar() {
  const router = useRouter();
  const { user, loading } = useUser(); // Moved useUser hook to the top level
  const [title, setTitle] = useState("Welcome");
  const [name, setName] = useState("guest");
  const [showMenu, setShowMenu] = useState(false);
  const { isTaskMenuOpen, toggleTaskMenu, toggleSearchMenu } =
    useContext(MenuContext);
  const [showContentMenu, setShowContentMenu] = useState(false);
  const [marginTop, setMarginTop] = useState(0);
  const [height, setHeight] = useState(0);
  const elementRef = useRef(null);
  const containerRef = useRef(null);

  const updateTitle = () => {
    setName(user.first_name);
  };

  const handleTaskMenuClick = () => {
    toggleTaskMenu();
  };

  const handleSearchMenuClick = () => {
    toggleSearchMenu();
  };
  const handlePPclick = () => {
    setShowMenu(!showMenu);
  };
  const updateDimensionsRef = useRef(() => {});
  useEffect(() => {
    updateDimensionsRef.current = () => {
      if (showMenu && elementRef.current) {
        const scale = showMenu ? 0.8 : 1;
        const rect = elementRef.current.getBoundingClientRect();

        const adjustedHeight = rect.height * scale;
        const adjustedTop = rect.top + (rect.height - adjustedHeight) / 2;
        setHeight(adjustedHeight);
        setMarginTop(adjustedTop);
      }
    };

    updateDimensionsRef.current();
    window.addEventListener("resize", updateDimensionsRef.current);

    return () => {
      window.removeEventListener("resize", updateDimensionsRef.current);
    };
  }, [showMenu, elementRef]);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/auth");
    }
  }, [user, loading, router]);
  useEffect(() => {
    if (user) {
      updateTitle();
    }
  }, [user]);

  useEffect(() => {
    const titles = {
      evening: "Good Evening,",
      night: "Good Night,",
      morning: "Good Morning,",
      afternoon: "Good Afternoon,",
      meal: "Bon Appétit,",
    };

    const currentHour = new Date().getHours();
    const getTitle = () => {
      if (currentHour >= 23 || currentHour < 6) return titles.night;
      if (currentHour >= 6 && currentHour < 12) return titles.morning;
      if (currentHour === 12) return titles.meal;
      if (currentHour > 12 && currentHour < 18) return titles.afternoon;
      return titles.evening;
    };

    setTitle(getTitle());
  }, []);
  useEffect(() => {
    if (showMenu) {
      const timer = setTimeout(() => {
        setShowContentMenu(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowContentMenu(false);
    }
  }, [showMenu]);
  if (loading) {
    return null;
  }

  return (
    <>
      <MainMenu
        containerRef={containerRef}
        showMenu={showMenu}
        showContentMenu={showContentMenu}
        marginTop={marginTop}
        height={height}
        name={name}
      />
      <ul
        className={`flex items-center justify-between`}
        style={{
          marginTop: "clamp(1vh, 2vh, 3vh)",
          fontSize: "clamp(0.25rem, 1vw + 0.1rem, 4rem)",
        }}
      >
        <li
          className={`grow-0 max-w-[7.0%] z-20 h-full`}
          style={{ padding: "0 clamp(1rem, 0.675cqi, 9rem" }}
        >
          <div
            className="cursor-pointer flex items-start justify-center"
            onClick={handlePPclick}
          >
            <Image
              ref={elementRef}
              src="/user/photo_profil_google.jpeg"
              alt="Profile Picture"
              width={150}
              height={150}
              priority={true}
              quality={100}
              className={`rounded-full transition-all duration-300 max-w-full ease ${
                showMenu ? "scale-[0.8]" : ""
              }`}
              onLoad={() => updateDimensionsRef.current()}
            />
          </div>
        </li>
        <li>
          <h1 className=" text-[4em] font-black">
            {title} <span className="text-blue">{name}</span>
          </h1>
        </li>
        <li className="flex max-w-[17.5%] gap-iconsContainer items-center justify-center h-full mr-[0.5vw]">
          <NavButton
            styles="border border-blue rounded-full shadow-2xl"
            onClick={handleSearchMenuClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="grow-0 shrink-0 w-full p-[20%]"
              aria-label="Search"
            >
              <path d="M3.624,15a8.03,8.03,0,0,0,10.619.659l5.318,5.318a1,1,0,0,0,1.414-1.414l-5.318-5.318A8.04,8.04,0,0,0,3.624,3.624,8.042,8.042,0,0,0,3.624,15Zm1.414-9.96a6.043,6.043,0,1,1-1.77,4.274A6,6,0,0,1,5.038,5.038Z"></path>
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
              className="flex justify-center items-center text-blue"
              aria-label="Add"
              fill="currentColor"
            >
              <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8 A8,8,0,0,1,12,20Zm4-9H13V8a1,1,0,0,0-2,0v3H8a1,1,0,0,0,0,2h3v3a1,1,0,0,0,2,0V13h3a1,1,0,0,0,0-2Z"></path>
            </svg>
          </NavButton>
        </li>
      </ul>{" "}
      <Blur
        trigger={handlePPclick}
        show={showMenu}
        showZ="10"
        hideZ="0"
        bg="bg-transparent"
        fullscreen={true}
      ></Blur>
    </>
  );
}

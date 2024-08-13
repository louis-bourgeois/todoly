"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Div from "../Div";
import Header from "./constantContent/Header";
import DefaultContent from "./main/DefaultContent";
import Account from "./settings/Account/Account";
import Appearance from "./settings/Appearence/Appearance";
import Languages from "./settings/Languages/Languages";
import Layout from "./settings/Layout/Layout";
import MainSettingsMenuContent from "./settings/MainSettingsMenuContent";
import Notifications from "./settings/Notifications/Notifications";

const LIBELLES = [
  { name: "Layout", width: "25vw" },
  { name: "Appearance", width: "25vw" },
  { name: "Notifications", width: "25vw" },
  { name: "Languages", width: "25vw" },
  { name: "Integrations", width: "25vw" },
  { name: "Main Menu", width: "17vw" },
  { name: "Account", width: "45vw" },
];

const LAYOUTS = {
  default: DefaultContent,
  settings: MainSettingsMenuContent,
  Layout,
  Appearance,
  Notifications,
  Languages,
  Account,
};

export default function MainMenu({
  containerRef,
  showContentMenu,
  showMenu,
  marginTop,
  setShowMenu,
  height,
  name,
  setProfilePictureVisibility,
  profilePictureVisibility,
}) {
  const [layout, setLayout] = useState("default");
  const [previousLayout, setPreviousLayout] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [width, setWidth] = useState("17vw");
  const contentRef = useRef(null);
  const wrapperRef = useRef(null);

  const currentLayout = useMemo(() => {
    return layout === "Main Menu" ? "default" : layout;
  }, [layout]);

  const handleSettingsChange = useCallback(
    (value) => {
      setPreviousLayout(layout);
      setLayout(value);
    },
    [layout]
  );

  useEffect(() => {
    if (!showMenu) setLayout("default");
  }, [showMenu]);

  useEffect(() => {
    const isDefaultOrSettings = layout === "default" || layout === "settings";
    if (isDefaultOrSettings) {
      setProfilePictureVisibility(true);
    }

    setIsTransitioning(true);

    const libelle = LIBELLES.find((l) => l.name === layout);
    const newWidth = libelle ? libelle.width : "17vw";

    // Set the wrapper to a fixed height before the transition
    if (wrapperRef.current && contentRef.current) {
      wrapperRef.current.style.height = `${contentRef.current.offsetHeight}px`;
    }

    // Start the transition
    setTimeout(() => {
      setWidth(isDefaultOrSettings ? "17vw" : newWidth);

      // After a short delay, update the height
      setTimeout(() => {
        if (wrapperRef.current && contentRef.current) {
          wrapperRef.current.style.height = `${contentRef.current.offsetHeight}px`;
        }
      }, 50);
    }, 0);

    // End the transition
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setPreviousLayout(null);
      if (wrapperRef.current) {
        wrapperRef.current.style.height = "auto";
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [layout, setProfilePictureVisibility]);

  const CurrentLayoutComponent = LAYOUTS[currentLayout] || (() => <></>);
  const PreviousLayoutComponent = previousLayout
    ? LAYOUTS[previousLayout]
    : null;

  return (
    <Div
      styles={`absolute bg-main_menu_bg ${
        profilePictureVisibility ? "z-20" : "z-[225]"
      } fontMenu top-0 left-0 flex flex-col justify-between rounded-[3.125vw] rounded-tl-[0] transition-all ease-in-out duration-300 ${
        showMenu ? "opacity-100" : "w-0 opacity-0"
      } overflow-hidden`}
      absolute
      notBorder
      style={{
        width: showMenu ? width : "0",
      }}
    >
      <Header
        name={name}
        handleSettingsChange={handleSettingsChange}
        layout={layout}
        containerRef={containerRef}
        showContentMenu={showContentMenu}
        marginTop={marginTop}
        height={height}
        setLayout={setLayout}
        setProfilePictureVisibility={setProfilePictureVisibility}
        libelles={LIBELLES}
      />
      <div
        ref={wrapperRef}
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{ padding: "25px 0" }} // Add some padding to prevent clipping
      >
        <div ref={contentRef} className="relative">
          {PreviousLayoutComponent && (
            <PreviousLayoutComponent
              transitionStyles=""
              setLayout={setLayout}
              libelles={LIBELLES}
            />
          )}

          <CurrentLayoutComponent
            setShowMenu={setShowMenu}
            transitionStyles=""
            setLayout={setLayout}
            libelles={LIBELLES}
          />
        </div>
      </div>
    </Div>
  );
}

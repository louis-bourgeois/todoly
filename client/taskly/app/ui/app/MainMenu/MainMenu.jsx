"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Div from "../Div";
import Header from "./constantContent/Header";
import DefaultContent from "./main/DefaultContent";
import Account from "./settings/Account/Account";
import Appearance from "./settings/Appearence/Appearance";
import Languages from "./settings/Languages/Languages";
import Layout from "./settings/Layout/Layout";
import MainSettingsMenuContent from "./settings/MainSettingsMenuContent";
import Notifications from "./settings/Notifications/Notifications";

// Precomputed dimensions for each panel.
// Note: the key for the default panel is "default", but we’ll display "Main Menu" in the header.
const LIBELLES = [
  { name: "Layout",        width: "25vw", height: "45vh" },
  { name: "Appearance",    width: "25vw", height: "31.5vh" },
  { name: "Notifications", width: "25vw", height: "38vh" },
  { name: "Languages",     width: "25vw", height: "45vh" },
  { name: "Integrations",  width: "25vw", height: "10vh" },
  { name: "default",       width: "17vw", height: "37.5vh" },
  { name: "Account",       width: "45vw", height: "40vh" },
];

// Mapping layout keys to components.
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
  height, // not used, but kept to avoid errors
  name,
  setProfilePictureVisibility,
  profilePictureVisibility,
}) {
  // Default dimensions for the default panel.
  const DEFAULT_WIDTH = "17vw";
  const DEFAULT_HEIGHT = "37.5vh";

  // Internal state for the active panel key.
  // We use "default" for the main panel.
  const [layout, setLayout] = useState("default");
  const [previousLayout, setPreviousLayout] = useState(null);
  const [menuWidth, setMenuWidth] = useState(DEFAULT_WIDTH);
  const [menuHeight, setMenuHeight] = useState(DEFAULT_HEIGHT);

  const contentRef = useRef(null);

  // Compute the header label separately.
  // When the internal layout is "default", we want the header label to be "Main Menu".
  const headerLabel = layout === "default" ? "Main Menu" : layout;

  // The current layout component is simply looked up via the internal layout key.
  const CurrentLayoutComponent = LAYOUTS[layout] || (() => <></>);
  const PreviousLayoutComponent = previousLayout ? LAYOUTS[previousLayout] : null;

  // Handle panel changes by recording the previous panel and updating layout.
  const handlePanelChange = useCallback(
    (newLayout) => {
      setPreviousLayout(layout);
      setLayout(newLayout);
    },
    [layout]
  );

  // When the menu opens/closes, reset the layout to "default".
  useEffect(() => {
    if (!showMenu) {
      setLayout("default");
    } else {
      // When reopening, reset dimensions and force profile picture visibility.
      setLayout("default");
      setMenuWidth(DEFAULT_WIDTH);
      setMenuHeight(DEFAULT_HEIGHT);
      setProfilePictureVisibility(true);
    }
  }, [showMenu, setProfilePictureVisibility]);

  // Update menu dimensions on layout change, using viewport scaling for height.
  useEffect(() => {
    // Display the profile picture only when in default or settings panels.
    if (layout === "default" || layout === "settings") {
      setProfilePictureVisibility(true);
    } else {
      setProfilePictureVisibility(false);
    }

    // Retrieve dimensions from LIBELLES (if defined) or use defaults.
    const libelle = LIBELLES.find((item) => item.name === layout) || { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
    let newWidth = libelle.width;
    let newHeight = libelle.height;

    // Special case: if the panel is "settings", force a specific height.
    if (layout === "settings") {
      newHeight = "66.5vh";
    }

    // Adjust the height if the viewport is larger than 1080px.
    if (typeof window !== "undefined") {
      const screenHeight = window.innerHeight;
      if (screenHeight > 1080) {
        const vhValue = parseFloat(newHeight.replace("vh", ""));
        // Scale down using a ratio (1080 / screenHeight) and add an offset (here, 15).
        const scaledVh = (layout !== "settings") ? (vhValue * (1080 / screenHeight) + 3) : (vhValue * (1080 / screenHeight));
        newHeight = `${scaledVh}vh`;
      }
    }

    setMenuWidth(newWidth);
    setMenuHeight(newHeight);
    setPreviousLayout(null);
  }, [layout, setProfilePictureVisibility]);

  return (
    <Div
      ref={containerRef}
      styles={`
        absolute bg-main_menu_bg ${profilePictureVisibility ? "z-20" : "z-[225]"}
        fontMenu top-0 left-0 flex flex-col justify-between rounded-[3.125vw] rounded-tl-[0]
        transition-all ease-in-out duration-300 ${showMenu ? "opacity-100" : "w-0 opacity-0"}
        overflow-hidden border border-gradient absolute
      `}
      absolute
      notBorder
      style={{
        width: showMenu ? menuWidth : "0",
        height: showMenu ? menuHeight : "0",
      }}
    >
      <Header
        name={name}
        // Pass the header label instead of the internal layout key.
        layout={headerLabel}
        handleSettingsChange={handlePanelChange}
        containerRef={containerRef}
        showContentMenu={showContentMenu}
        marginTop={marginTop}
        height={height}
        setLayout={setLayout}
        setProfilePictureVisibility={setProfilePictureVisibility}
        libelles={LIBELLES}
      />
      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{ padding: "25px 0" }}
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

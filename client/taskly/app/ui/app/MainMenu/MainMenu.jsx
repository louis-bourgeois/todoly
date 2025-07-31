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
import EditProfile from "./settings/EditProfile";
import Integrations from "./settings/Integrations/Integrations";
import { useTranslation } from "../../../i18n/client";

// Precomputed dimensions for each panel.
// Note: the key for the default panel is "default", but we’ll display "Main Menu" in the header.
const LIBELLES = [
  { name: "Layout",        width: "25vw"},
  { name: "Appearance",    width: "25vw"},
  { name: "Notifications", width: "25vw"},
  { name: "Languages",     width: "25vw"},
  { name: "Integrations",  width: "25vw"},
  { name: "default",       width: "16vw"},
  { name: "Account",       width: "45vw"},
  { name: "Data",          width: "45vw"},
];

// Mapping layout keys to components.
const LAYOUTS = {
  default: DefaultContent,
  settings: MainSettingsMenuContent,
  Layout,
  Appearance,
  Notifications,
  Languages,
  Integrations,
  Account,
  Data: EditProfile,
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
  const { t } = useTranslation();
  // Default dimensions for the default panel.
  const DEFAULT_WIDTH = LIBELLES.find((item) => item.name === "default").width;


  // Internal state for the active panel key.
  // We use "default" for the main panel.
  const [layout, setLayout] = useState("default");
  const [previousLayout, setPreviousLayout] = useState(null);
  const [menuWidth, setMenuWidth] = useState(DEFAULT_WIDTH);

  const contentRef = useRef(null);

  // Compute the header label separately.
  // When the internal layout is "default", we want the header label to be "Main Menu".
  const headerLabel = layout === "default" ? t('mainMenu.mainMenu') : layout;

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
    const libelle = LIBELLES.find((item) => item.name === layout) || { width: DEFAULT_WIDTH };
    let newWidth = libelle.width;

    setMenuWidth(newWidth);
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
        maxHeight: showMenu ? "9999px" : "0", // Use maxHeight for smooth animation
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
        ref={contentRef}
        className="a overflow-hidden"
        style={{ padding: "25px 0" }}
      >
        <div className="relative">
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
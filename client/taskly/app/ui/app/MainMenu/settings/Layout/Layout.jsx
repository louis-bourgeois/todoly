import { useState, useEffect } from "react";
import { useUserPreferences } from "../../../../../../context/UserPreferencesContext";
import DropdownMenu from "../DropdownMenu";
import SectionTitle from "../SectionTitle";

export default function Layout({ transitionStyles }) {
  const { updatePreference, preferences } = useUserPreferences();
  const defaultTitle = "default"; 
  const [defaultMainPage, setDefaultMainPage] = useState(
    preferences.Default_Main_Page
  );
  const [homePageTitle, setHomePageTitle] = useState(defaultTitle);
  useEffect(() => {
    setDefaultMainPage(preferences.Default_Main_Page);
    setHomePageTitle(preferences.Home_Page_Title);
  }, [preferences]);

  const handleMainPageChange = async (value) => {
    setDefaultMainPage(value);
    await updatePreference({ key: "Default_Main_Page", value: value });
  };


  const handleHomePageTitleChange = (event) => {
    const value = event.target.value;
    setHomePageTitle(value);
  };

  const handleHomePageTitleBlur = async () => {
    const trimmedValue = homePageTitle.trim();
    const finalValue = trimmedValue === "" ? defaultTitle : homePageTitle;
    if (finalValue !== homePageTitle) {
      setHomePageTitle(finalValue);
    }
    await updatePreference({ key: "Home_Page_Title", value: finalValue });
  };

  const handleResetHomePageTitle = async () => {
    setHomePageTitle(defaultTitle);
    await updatePreference({ key: "Home_Page_Title", value: defaultTitle });
  };

  return (
    <div
      className={`flex flex-col w-full px-[4%] mt-[4%] gap-[1.75vh] justify-start ${transitionStyles}`}
    >
      <SectionTitle className="text-text">Default Home Page</SectionTitle>
      <DropdownMenu
        title={defaultMainPage}
        options={["Currently", "All"]}
        onSelect={handleMainPageChange}
      />
      <SectionTitle>Home Page Title</SectionTitle>
      <div className="flex items-center gap-2">
        <input
          type="text"
          onChange={handleHomePageTitleChange}
          onBlur={handleHomePageTitleBlur}
          value={homePageTitle}
          className="border bg-primary text-text border-secondary h-[4.5vh] text-base flex-1 rounded-[10px] placeholder:text-base text-right px-5"
        />
        <button
          onClick={handleResetHomePageTitle}
          className="px-3 py-1 bg-secondary text-primary rounded hover:scale-105 active:scale-100 transition-all duration-200 ease-out"
        >
          Reset
        </button>
      </div>

      <button className="font-bold text-l text-text rounded-full border border-secondary hover:scale-105 active:scale-100 hover:text-dominant transition-all duration-200 ease-out m-[3%] p-[3%]">
        Customise the Add Menu
      </button>
    </div>
  );
}

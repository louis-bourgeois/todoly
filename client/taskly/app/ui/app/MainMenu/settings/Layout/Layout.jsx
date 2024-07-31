import { useState } from "react";
import { useUserPreferences } from "../../../../../../context/UserPreferencesContext";
import DropdownMenu from "../DropdownMenu";
import SectionTitle from "../SectionTitle";

export default function Layout({ transitionStyles }) {
  const { updatePreference, preferences } = useUserPreferences();
  const [defaultMainPage, setDefaultMainPage] = useState(
    preferences.Default_Main_Page
  );
  const [homePageTitle, setHomePageTitle] = useState(
    preferences.Home_Page_Title
  );

  const handleMainPageChange = async (value) => {
    setDefaultMainPage(value);
    await updatePreference({ key: "Default_Main_Page", value: value });
  };

  const handleHomePageTitleChange = async (event) => {
    const value = event.target.value;
    setHomePageTitle(value);
    await updatePreference({ key: "Home_Page_Title", value: value });
  };
  return (
    <div
      className={`flex flex-col w-full px-[4%] mt-[4%] gap-[1.75vh] justify-start ${transitionStyles}`}
    >
      <SectionTitle>Default Home Page</SectionTitle>
      <DropdownMenu
        title={defaultMainPage}
        options={["Currently", "All"]}
        onClick={handleMainPageChange}
      />
      <SectionTitle>Home Page Title</SectionTitle>
      <input
        type="text"
        onChange={handleHomePageTitleChange}
        value={homePageTitle}
        className="border border-black h-[4.5vh] text-base flex justify-between rounded-[10px] placeholder:text-base text-right px-5"
      />

      <button className="font-bold text-l rounded-full border border-black hover:scale-105 active:scale-100 hover:text-dominant transition-all duration-200 ease-out m-[3%] p-[3%]">
        Customise the Add Menu
      </button>
    </div>
  );
}

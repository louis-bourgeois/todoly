import { useState } from "react";
import { useUser } from "../../../../../../context/UserContext";
import { useUserPreferences } from "../../../../../../context/UserPreferencesContext";
import DropdownMenu from "../DropdownMenu";
import SectionTitle from "../SectionTitle";

export default function Layout({ transitionStyles }) {
  const { preferences } = useUser();
  const { updateUserPreference } = useUserPreferences();
  const [defaultMainPage, setDefaultMainPage] = useState(
    preferences?.Default_Main_Page
  );
  const [homePageTitle, setHomePageTitle] = useState(
    preferences?.Home_Page_Title
  );

  const handleMainPageChange = (value) => {
    setDefaultMainPage(value);
    updateUserPreference({ key: "Default_Main_Page", value: value });
  };

  const handleHomePageTitleChange = (event) => {
    const value = event.target.value;
    setHomePageTitle(value);
    updateUserPreference({ key: "Home_Page_Title", value: value });
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
        className="border border-black h-[4.5vh] flex justify-between rounded-[10px] placeholder:text-base text-right px-5"
      />

      <button className="font-bold text-2xl rounded-full border border-black hover:scale-105 active:scale-100 hover:text-blue transition-all duration-200 ease-out m-[3%] p-[3%]">
        Customise the Add Menu
      </button>
    </div>
  );
}

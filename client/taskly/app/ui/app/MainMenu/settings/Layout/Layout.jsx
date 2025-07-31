import { useState, useEffect } from "react";
import { useUserPreferences } from "../../../../../../context/UserPreferencesContext";
import DropdownMenu from "../DropdownMenu";
import SectionTitle from "../SectionTitle";
import { useTranslation } from "@/app/i18n/client";

export default function Layout({ transitionStyles }) {
  const { updatePreference, preferences } = useUserPreferences();
  const { t } = useTranslation();
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
    let sent_value = value
    if (value === "Actuellement") {
      sent_value = "Currently"
    } else if (value === "Tous") {
      sent_value = "All"
    }

    console.log(sent_value)  
    await updatePreference({ key: "Default_Main_Page", value: sent_value });
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
      <SectionTitle className="text-text">{t('layout.defaultHomePage')}</SectionTitle>
      <DropdownMenu
        title={t(`layout.${defaultMainPage?.toLowerCase()}`)}
        options={[t('layout.currently'), t('layout.all')]}
        onSelect={handleMainPageChange}
      />
      <SectionTitle>{t('layout.homePageTitle')}</SectionTitle>
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
          {t('layout.reset')}
        </button>
      </div>

      <div className="relative m-[3%]">
        <button
          disabled
          className="w-full font-bold text-l text-text rounded-full border border-secondary p-[3%] transition-all duration-200 ease-out cursor-not-allowed peer"
        >
          {t('layout.customizeAddMenu')}
        </button>
        <div className="absolute hidden peer-hover:block -top-0 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs rounded-lg py-1 px-2">
          {t('recurrence.notAvailable')}
        </div>
      </div>
    </div>
  );
}
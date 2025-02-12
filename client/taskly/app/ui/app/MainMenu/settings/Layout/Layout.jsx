import { useState, useEffect } from "react";
import { useUserPreferences } from "../../../../../../context/UserPreferencesContext";
import DropdownMenu from "../DropdownMenu";
import SectionTitle from "../SectionTitle";

export default function Layout({ transitionStyles }) {
  const { updatePreference, preferences } = useUserPreferences();
  // On définit defaultTitle à partir de la valeur par défaut de l'input (par exemple user.name)
  const defaultTitle = "default"; 
  const [defaultMainPage, setDefaultMainPage] = useState(
    preferences.Default_Main_Page
  );
  const [homePageTitle, setHomePageTitle] = useState(defaultTitle);

  // Si les préférences changent depuis le contexte, on met à jour nos states locaux
  useEffect(() => {
    setDefaultMainPage(preferences.Default_Main_Page);
    setHomePageTitle(preferences.Home_Page_Title);
  }, [preferences]);

  const handleMainPageChange = async (value) => {
    console.log("update", value);
    setDefaultMainPage(value);
    await updatePreference({ key: "Default_Main_Page", value: value });
  };

  // On met à jour le state à chaque frappe
  const handleHomePageTitleChange = (event) => {
    const value = event.target.value;
    setHomePageTitle(value);
  };

  // Lors du blur, on sauvegarde en s'assurant que le titre n'est pas seulement composé d'espaces
  const handleHomePageTitleBlur = async () => {
    const trimmedValue = homePageTitle.trim();
    // Si l'utilisateur a effacé (ou saisi uniquement des espaces), on revient à la valeur par défaut
    const finalValue = trimmedValue === "" ? defaultTitle : homePageTitle;
    if (finalValue !== homePageTitle) {
      setHomePageTitle(finalValue);
    }
    await updatePreference({ key: "Home_Page_Title", value: finalValue });
  };

  // Bouton reset qui réinitialise le titre d'accueil à sa valeur par défaut
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

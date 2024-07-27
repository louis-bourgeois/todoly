import { redirect } from "next/dist/server/api-utils";
import MobileMainMenu from "./MainMenu/MobileMainMenu";
import MobileMainButtons from "./SearchSections/mainButtons/MobileMainButtons";
import MobileSearchSection from "./SearchSections/MobileSearchSection";
import MobileSearchInput from "./SearchSections/searchMenu/MobileSearchInput";

export default function MobileFooter({ onNavigate }) {
  const handleNavigation = (path) => {
    redirect(path);
  };
  return (
    <footer className="fixed bottom-[20px] px-[17.5px] h-[15dvh] w-full flex flex-col items-center justify-between gap-[2vh]">
      <MobileSearchSection>
        <MobileSearchInput onNavigate={handleNavigation} />
        <MobileMainButtons />
      </MobileSearchSection>
      <MobileMainMenu />
    </footer>
  );
}
